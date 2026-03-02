const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-[var(--accent-orange)] focus:text-white focus:font-bold focus:rounded-full focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all"
        >
            Skip to Main Content
        </a>
    );
};

export default SkipLink;
