import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}: PaginationProps) => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5;

        if (totalPages <= showPages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    if (totalPages === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)] font-medium">Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-orange)]"
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <span className="text-sm text-[var(--text-secondary)] font-medium">
                    of {totalItems} items
                </span>
            </div>

            {/* Page Info */}
            <div className="text-sm text-[var(--text-secondary)] font-medium">
                Showing {startItem}-{endItem} of {totalItems}
            </div>

            {/* Page Navigation */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="First Page"
                >
                    <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Previous Page"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={page === '...'}
                        className={`min-w-[36px] h-9 rounded-lg font-bold text-sm transition-all ${page === currentPage
                                ? 'bg-[var(--accent-orange)] text-white'
                                : page === '...'
                                    ? 'text-[var(--text-secondary)] cursor-default'
                                    : 'hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Next Page"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    title="Last Page"
                >
                    <ChevronsRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
