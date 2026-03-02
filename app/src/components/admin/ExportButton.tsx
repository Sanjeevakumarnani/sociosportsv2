import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

interface ExportButtonProps {
    data: any[];
    filename: string;
    columns: { key: string; header: string }[];
}

const ExportButton = ({ data, filename, columns }: ExportButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const exportToCSV = () => {
        try {
            const csvData = data.map(item =>
                columns.reduce((acc, col) => ({
                    ...acc,
                    [col.header]: item[col.key] || ''
                }), {})
            );

            const headers = columns.map(col => col.header);
            const rows = csvData.map(row => Object.values(row));

            let csvContent = headers.join(',') + '\n';
            rows.forEach(row => {
                csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
            });

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();

            toast.success('Exported to CSV successfully!');
        } catch (error) {
            toast.error('Failed to export CSV');
        }
        setIsOpen(false);
    };

    const exportToPDF = () => {
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(filename, 14, 15);

            // Date
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);

            // Table
            const tableData = data.map(item =>
                columns.map(col => String(item[col.key] || ''))
            );

            autoTable(doc, {
                startY: 30,
                head: [columns.map(col => col.header)],
                body: tableData,
                styles: {
                    fontSize: 8,
                    cellPadding: 2,
                },
                headStyles: {
                    fillColor: [255, 94, 20],
                    fontStyle: 'bold',
                },
                alternateRowStyles: {
                    fillColor: [245, 245, 245],
                },
            });

            doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Exported to PDF successfully!');
        } catch (error) {
            toast.error('Failed to export PDF');
        }
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] font-bold transition-all"
            >
                <Download className="w-4 h-4" />
                Export
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-xl z-20 overflow-hidden">
                        <button
                            onClick={exportToCSV}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-primary)] text-[var(--text-primary)] text-left transition-all"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-green-500" />
                            <span className="font-medium">Export as CSV</span>
                        </button>
                        <div className="border-t border-[var(--border)]" />
                        <button
                            onClick={exportToPDF}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-primary)] text-[var(--text-primary)] text-left transition-all"
                        >
                            <FileText className="w-4 h-4 text-red-500" />
                            <span className="font-medium">Export as PDF</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;
