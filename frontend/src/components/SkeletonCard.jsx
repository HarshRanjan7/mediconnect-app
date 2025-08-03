export default function SkeletonCard() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-20 w-20"></div>
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );
}