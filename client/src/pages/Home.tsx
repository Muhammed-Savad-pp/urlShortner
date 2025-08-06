import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { BarChart3, ChevronLeft, ChevronRight, Clock, Copy, Link, Search, Shield, X, Zap } from "lucide-react";
import { convertUrl, fetchUrls } from "../services/url/urlService";
import { toast } from "react-toastify";
import { debounce } from "lodash";

interface ShortenedUrl {
    _id: string;
    userId: string;
    originalUrl: string;
    shortUrl: string;
    createAt: Date;
}

function Home() {

    const [url, setUrl] = useState<string>('');
    const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(10);
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [shortUrl, setShortUrl] = useState<string | null>(null)
    const limit = 3;



    useEffect(() => {
        const getUrls = async () => {
            const response = await fetchUrls(page, limit, debouncedSearch);
            setShortenedUrls(response.urlData);
            setTotalPages(response.totalPages)
        }

        getUrls()
    }, [page, debouncedSearch])

    const isValidUrl = (string: string): boolean => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const handleShorten = async (): Promise<void> => {
        if (!url.trim()) return;

        if (!isValidUrl(url)) {
            toast.error('Please enter a valid URL')
            return;
        }

        setIsLoading(true);

        try {

            const response: any = await convertUrl(url);

            if (response.success) {
                toast.success(response.message);
                setShortenedUrls(prev => [response.newUrl, ...prev]);
                setShortUrl(response.newUrl.shortUrl);
            } else {
                toast.error(response.message)
            }

        } catch (error) {
            console.log(error)
        }

        setUrl('');
        setIsLoading(false);
    };

    const debounceSearch = useCallback(
        debounce((value: string) => {
            setDebouncedSearch(value)
        }, 1000),
        []
    )

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        debounceSearch(e.target.value)
    }

    const copyToClipboard = async (text: string): Promise<void> => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copied to clipboard!')
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleShorten();
        }
    };

    const clearSearch = (): void => {
        setSearchTerm('');
        setPage(1);
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handlePageChange = (page: number): void => {
        setPage(page);
    };

    return (
        <div className='min-h-screen bg-[#0e0d0d]'>
            <Navbar />

            {/* Hero Section */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Shorten Your <span className="text-green-400">URLs</span>
                    </h1>
                    <p className="text-gray-400 text-lg mb-2">
                        Fast, reliable, and secure URL shortening service
                    </p>
                    <p className="text-gray-500 text-sm">
                        Transform long URLs into clean, shareable links in seconds
                    </p>
                </div>

                {/* URL Shortener Input */}
                <div className="flex justify-center w-full mb-7">
                    <div className="w-full max-w-3xl bg-gray-800 rounded-lg border border-green-500/30 p-6 shadow-2xl">
                        <div className="flex flex-col sm:flex-row gap-4 mb-3">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter your long URL here..."
                                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all"
                            />
                            <button
                                onClick={handleShorten}
                                disabled={isLoading || !url.trim()}
                                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Shortening...
                                    </>
                                ) : (
                                    <>
                                        <Zap size={18} />
                                        Shorten
                                    </>
                                )}
                            </button>
                        </div>

                        {shortUrl && (
                            <div className="flex  w-full justify-center">
                                <div className="flex w-full max-w-2xl bg-gray-900 p-2 rounded-lg border border-green-500/30 justify-between">
                                    <div className="flex gap-2 items-center">
                                        <p className="text-lg text-gray-100 font-semibold">Shortend URL : </p>
                                        <span className="text-green-400 text-md">{shortUrl}</span>
                                    </div>

                                    <button
                                        onClick={() => copyToClipboard(shortUrl)}
                                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Copy size={14} />
                                        Copy
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>



                <div className="max-w-3xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Clock className="text-green-400" size={24} />
                            Your Shortened URLs ({shortenedUrls.length})
                        </h2>

                        {/* Search Bar */}
                        <div className="relative">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        handleSearchChange(e);
                                        setPage(1);
                                    }}
                                    placeholder="Search URLs..."
                                    className="bg-gray-800 text-white border border-gray-700 rounded-lg pl-10 pr-10 py-2 w-64 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all text-sm"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {shortenedUrls.length === 0 ? (
                        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
                            <Search className="mx-auto text-gray-500 mb-4" size={48} />
                            <p className="text-gray-400 text-lg">No URLs found matching "{searchTerm}"</p>
                            <button
                                onClick={clearSearch}
                                className="mt-4 text-green-400 hover:text-green-300 transition-colors"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* URLs List */}
                            <div className="space-y-4 mb-6">
                                {shortenedUrls.map((item) => (
                                    <div key={item._id} className="bg-gray-800 border border-green-500/20 rounded-lg p-4 hover:border-green-500/40 transition-all">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Link className="text-green-400 flex-shrink-0" size={16} />
                                                    <a
                                                        href={item.shortUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-400 hover:text-green-300 font-mono text-sm font-semibold truncate"
                                                    >
                                                        {item.shortUrl}
                                                    </a>
                                                </div>
                                                <p className="text-gray-400 text-xs truncate mb-1">{item.originalUrl}</p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Created {formatDate(item.createAt)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(item.shortUrl)}
                                                className="bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                                            >
                                                <Copy size={14} />
                                                Copy
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center bg-gray-800 border border-green-500/20 rounded-lg p-4">
                                    <div className="text-sm text-gray-400">
                                        {/* Showing {startIndex + 1}-{Math.min(endIndex, filteredUrls.length)} of {filteredUrls.length} URLs */}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 1}
                                            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>

                                        <div className="flex gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pages) => (
                                                <button
                                                    key={pages}
                                                    onClick={() => handlePageChange(pages)}
                                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${page === pages
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {pages}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>


                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-7">
                    <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6 text-center">
                        <Zap className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
                        <p className="text-gray-400 text-sm">Shorten URLs in milliseconds with our optimized infrastructure</p>
                    </div>
                    <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6 text-center">
                        <Shield className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-white font-semibold mb-2">Secure & Safe</h3>
                        <p className="text-gray-400 text-sm">Enterprise-grade security with SSL encryption and malware protection</p>
                    </div>
                    <div className="bg-gray-800 border border-green-500/20 rounded-lg p-6 text-center">
                        <BarChart3 className="text-green-400 mx-auto mb-3" size={32} />
                        <h3 className="text-white font-semibold mb-2">Analytics</h3>
                        <p className="text-gray-400 text-sm">Track clicks, locations, and performance with detailed analytics</p>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default Home