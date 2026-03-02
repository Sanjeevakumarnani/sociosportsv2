import { Request, Response } from 'express';
import { prisma } from '../index';
import { v4 as uuidv4 } from 'uuid';
import {
  sendVerificationSubmittedEmail,
  sendVerificationApprovedEmail,
  sendVerificationRejectedEmail
} from '../services/emailService';

// Generate unique verification token
const generateVerificationToken = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
  const uuidPart = uuidv4().split('-')[0].toUpperCase();
  return `SOCIO-VER-${randomPart}${uuidPart}`;
};

// @desc    Submit employer verification request
// @route   POST /api/employer-verification/submit
// @access  Private (requires auth)
export const submitVerification = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user already has a pending or approved verification
    const existingVerification = await prisma.employerVerification.findUnique({
      where: { userId }
    });

    if (existingVerification) {
      if (existingVerification.status === 'APPROVED') {
        return res.status(400).json({
          error: 'You are already verified',
          status: 'APPROVED'
        });
      }
      if (existingVerification.status === 'PENDING' || existingVerification.status === 'UNDER_REVIEW') {
        return res.status(400).json({
          error: 'You already have a pending verification request',
          token: existingVerification.token,
          status: existingVerification.status
        });
      }
      // If rejected, allow resubmission by deleting old record
      await prisma.employerVerification.delete({
        where: { userId }
      });
    }

    const {
      companyName,
      organizationEmail,
      contactNumber,
      companyRegistrationUrl,
      gstCertificateUrl,
      idProofUrl
    } = req.body;

    // Validate required fields
    if (!companyName || !organizationEmail || !contactNumber) {
      return res.status(400).json({
        error: 'Company name, organization email, and contact number are required'
      });
    }

    if (!companyRegistrationUrl && !idProofUrl) {
      return res.status(400).json({
        error: 'At least one document (Company Registration or ID Proof) is required'
      });
    }

    // Generate unique token
    let token = generateVerificationToken();
    let tokenExists = await prisma.employerVerification.findUnique({
      where: { token }
    });

    // Ensure token is unique
    while (tokenExists) {
      token = generateVerificationToken();
      tokenExists = await prisma.employerVerification.findUnique({
        where: { token }
      });
    }

    // Create verification request
    const verification = await prisma.employerVerification.create({
      data: {
        userId,
        companyName,
        organizationEmail,
        contactNumber,
        companyRegistrationUrl,
        gstCertificateUrl,
        idProofUrl,
        token,
        status: 'PENDING'
      }
    });

    // Update user verification status
    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: token,
        verificationStatus: 'PENDING'
      }
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Verification Submitted',
        message: `Your employer verification request has been submitted successfully. Track your status with token: ${token}`,
        type: 'VERIFICATION_SUBMITTED',
        data: JSON.stringify({ token })
      }
    });

    // Send email notification (optional/async)
    try {
      await sendVerificationSubmittedEmail(organizationEmail, companyName, token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail the whole request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Verification request submitted successfully',
      token: verification.token,
      verification: {
        id: verification.id,
        status: verification.status,
        submittedAt: verification.submittedAt
      }
    });
  } catch (error: any) {
    console.error('Submit verification error details:', {
      error,
      body: req.body,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Failed to submit verification request',
      message: error.message || 'An unexpected error occurred'
    });
  }
};

// @desc    Get current user's verification status
// @route   GET /api/employer-verification/status
// @access  Private (requires auth)
export const getVerificationStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const verification = await prisma.employerVerification.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isVerified: true,
            verificationStatus: true
          }
        }
      }
    });

    if (!verification) {
      return res.json({
        hasVerification: false,
        isVerified: false,
        status: null
      });
    }

    res.json({
      hasVerification: true,
      isVerified: verification.status === 'APPROVED',
      status: verification.status,
      token: verification.token,
      adminRemarks: verification.adminRemarks,
      submittedAt: verification.submittedAt,
      reviewedAt: verification.reviewedAt,
      user: verification.user
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ error: 'Failed to get verification status' });
  }
};

// @desc    Track verification status by token
// @route   GET /api/employer-verification/track/:token
// @access  Public
export const trackByToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const tokenStr = Array.isArray(token) ? token[0] : token;

    if (!tokenStr || !tokenStr.startsWith('SOCIO-VER-')) {
      return res.status(400).json({ error: 'Invalid token format' });
    }

    const verification = await prisma.employerVerification.findUnique({
      where: { token: tokenStr },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            isVerified: true
          }
        }
      }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    // Return status without sensitive information
    res.json({
      token: verification.token,
      status: verification.status,
      companyName: verification.companyName,
      submittedAt: verification.submittedAt,
      reviewedAt: verification.reviewedAt,
      adminRemarks: verification.status === 'REJECTED' ? verification.adminRemarks : null,
      isVerified: verification.status === 'APPROVED'
    });
  } catch (error) {
    console.error('Track verification error:', error);
    res.status(500).json({ error: 'Failed to track verification' });
  }
};

// @desc    Get all verification requests (Admin)
// @route   GET /api/employer-verification/admin/all
// @access  Private (Admin only)
export const getAllVerifications = async (req: Request, res: Response) => {
  try {
    const { status, page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status && ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].includes(status as string)) {
      where.status = status;
    }

    const [verifications, total] = await Promise.all([
      prisma.employerVerification.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              isVerified: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.employerVerification.count({ where })
    ]);

    res.json({
      verifications,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all verifications error:', error);
    res.status(500).json({ error: 'Failed to fetch verifications' });
  }
};

// @desc    Get single verification details (Admin)
// @route   GET /api/employer-verification/admin/:id
// @access  Private (Admin only)
export const getVerificationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const verification = await prisma.employerVerification.findUnique({
      where: { id: idStr },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            isVerified: true,
            createdAt: true
          }
        }
      }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    res.json(verification);
  } catch (error) {
    console.error('Get verification error:', error);
    res.status(500).json({ error: 'Failed to fetch verification' });
  }
};

// @desc    Approve verification request (Admin)
// @route   PUT /api/employer-verification/admin/:id/approve
// @access  Private (Admin only)
export const approveVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const adminId = (req as any).user?.id;

    const verification = await prisma.employerVerification.findUnique({
      where: { id: idStr },
      include: { user: true }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    if (verification.status === 'APPROVED') {
      return res.status(400).json({ error: 'Verification already approved' });
    }

    // Update verification and user in transaction
    const [updatedVerification] = await prisma.$transaction([
      prisma.employerVerification.update({
        where: { id: idStr },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date()
        }
      }),
      prisma.user.update({
        where: { id: verification.userId },
        data: {
          isVerified: true,
          verificationStatus: 'APPROVED'
        }
      }),
      prisma.notification.create({
        data: {
          userId: verification.userId,
          title: 'Verification Approved!',
          message: 'Congratulations! Your employer verification has been approved. You can now post jobs on SocioSports.',
          type: 'VERIFICATION_APPROVED'
        }
      })
    ]);

    res.json({
      success: true,
      message: 'Verification approved successfully',
      verification: updatedVerification
    });
  } catch (error) {
    console.error('Approve verification error:', error);
    res.status(500).json({ error: 'Failed to approve verification' });
  }
};

// @desc    Reject verification request (Admin)
// @route   PUT /api/employer-verification/admin/:id/reject
// @access  Private (Admin only)
export const rejectVerification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;
    const { remarks } = req.body;

    if (!remarks || remarks.trim().length < 10) {
      return res.status(400).json({
        error: 'Please provide a reason for rejection (at least 10 characters)'
      });
    }

    const verification = await prisma.employerVerification.findUnique({
      where: { id: idStr },
      include: { user: true }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    if (verification.status === 'APPROVED') {
      return res.status(400).json({ error: 'Cannot reject an approved verification' });
    }

    // Update verification and user in transaction
    const [updatedVerification] = await prisma.$transaction([
      prisma.employerVerification.update({
        where: { id: idStr },
        data: {
          status: 'REJECTED',
          adminRemarks: remarks,
          reviewedAt: new Date()
        }
      }),
      prisma.user.update({
        where: { id: verification.userId },
        data: {
          isVerified: false,
          verificationStatus: 'REJECTED'
        }
      }),
      prisma.notification.create({
        data: {
          userId: verification.userId,
          title: 'Verification Update',
          message: `Your employer verification was declined. Reason: ${remarks}`,
          type: 'VERIFICATION_REJECTED',
          data: JSON.stringify({ reason: remarks })
        }
      })
    ]);

    res.json({
      success: true,
      message: 'Verification rejected',
      verification: updatedVerification
    });
  } catch (error) {
    console.error('Reject verification error:', error);
    res.status(500).json({ error: 'Failed to reject verification' });
  }
};

// @desc    Set verification to under review (Admin)
// @route   PUT /api/employer-verification/admin/:id/review
// @access  Private (Admin only)
export const setUnderReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const verification = await prisma.employerVerification.findUnique({
      where: { id: idStr }
    });

    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    const updatedVerification = await prisma.employerVerification.update({
      where: { id: idStr },
      data: { status: 'UNDER_REVIEW' }
    });

    res.json({
      success: true,
      verification: updatedVerification
    });
  } catch (error) {
    console.error('Set under review error:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
};
