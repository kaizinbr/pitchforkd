// Loading animation
const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
    return (
        <div
            className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
        >
            <div className="flex p-4">
                <div className="h-5 w-5 rounded-md bg-gray-200" />
                <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
            </div>
            <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
                <div className="h-7 w-20 rounded-md bg-gray-200" />
            </div>
        </div>
    );
}

export function CardsSkeleton() {
    return (
        <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </>
    );
}

export function RevenueChartSkeleton() {
    return (
        <div
            className={`${shimmer} relative w-full overflow-hidden md:col-span-4`}
        >
            <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
            <div className="rounded-xl bg-gray-100 p-4">
                <div className="sm:grid-cols-13 mt-0 grid h-[410px] grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4" />
                <div className="flex items-center pb-2 pt-6">
                    <div className="h-5 w-5 rounded-full bg-gray-200" />
                    <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

export function InvoiceSkeleton() {
    return (
        <div className="flex flex-row items-center justify-between border-b border-gray-100 py-4">
            <div className="flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-gray-200" />
                <div className="min-w-0">
                    <div className="h-5 w-40 rounded-md bg-gray-200" />
                    <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
                </div>
            </div>
            <div className="mt-2 h-4 w-12 rounded-md bg-gray-200" />
        </div>
    );
}

export function LatestInvoicesSkeleton() {
    return (
        <div
            className={`${shimmer} relative flex w-full flex-col overflow-hidden md:col-span-4`}
        >
            <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" />
            <div className="flex grow flex-col justify-between rounded-xl bg-gray-100 p-4">
                <div className="bg-white px-6">
                    <InvoiceSkeleton />
                    <InvoiceSkeleton />
                    <InvoiceSkeleton />
                    <InvoiceSkeleton />
                    <InvoiceSkeleton />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <div className="h-5 w-5 rounded-full bg-gray-200" />
                    <div className="ml-2 h-4 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

export default function DashboardSkeleton() {
    return (
        <>
            <div
                className={`${shimmer} relative mb-4 h-8 w-36 overflow-hidden rounded-md bg-gray-100`}
            />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <RevenueChartSkeleton />
                <LatestInvoicesSkeleton />
            </div>
        </>
    );
}

export function TableRowSkeleton() {
    return (
        <tr className="w-full border-b border-gray-700 last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
            {/* Customer Name and Image */}
            <td className="relative overflow-hidden whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-700"></div>
                    <div className="h-6 w-24 rounded bg-gray-700"></div>
                </div>
            </td>
            {/* Email */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-32 rounded bg-gray-700"></div>
            </td>
            {/* Amount */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-16 rounded bg-gray-700"></div>
            </td>
            {/* Date */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-16 rounded bg-gray-700"></div>
            </td>
            {/* Status */}
            <td className="whitespace-nowrap px-3 py-3">
                <div className="h-6 w-16 rounded bg-gray-700"></div>
            </td>
            {/* Actions */}
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex justify-end gap-3">
                    <div className="h-[38px] w-[38px] rounded bg-gray-700"></div>
                    <div className="h-[38px] w-[38px] rounded bg-gray-700"></div>
                </div>
            </td>
        </tr>
    );
}

// thanks to https://codepen.io/danvim/pen/XWxNGOx
export function InvoicesMobileSkeleton() {
    return (
        <div className="mb-2 w-full h-full flex justify-center items-center rounded-md  p-4">
            <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5">
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-90;810"
                        keyTimes="0;1"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-dashoffset"
                        values="0%;0%;-157.080%"
                        calcMode="spline"
                        keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0"
                        keyTimes="0;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-dasharray"
                        values="0% 314.159%;157.080% 157.080%;0% 314.159%"
                        calcMode="spline"
                        keySplines="0.61, 1, 0.88, 1; 0.12, 0, 0.39, 0"
                        keyTimes="0;0.5;1"
                        dur="2s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
        </div>
    );
}

export function InvoicesTableSkeleton() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        <InvoicesMobileSkeleton />
                        <InvoicesMobileSkeleton />
                        <InvoicesMobileSkeleton />
                        <InvoicesMobileSkeleton />
                        <InvoicesMobileSkeleton />
                        <InvoicesMobileSkeleton />
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-4 py-5 font-medium sm:pl-6"
                                >
                                    Customer
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Amount
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-5 font-medium"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="relative pb-4 pl-3 pr-6 pt-2 sm:pr-6"
                                >
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                            <TableRowSkeleton />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export function RatingCardSkeleton() {
    return (
        <div
            className={`
                        flex flex-col 
                        max-w-[600px] w-full
                        transition-all duration-200 ease-in-out   
                        overflow-hidden relative
                        p-5
                    `}
        >
            <div className="z-20">
                <div className="flex flex-row items-center gap-2">
                    <div className="flex relative flex-col justify-center items-center size-8 rounded-full">
                        <div className={"size-8 rounded-full bg-neutral-600"} />
                    </div>
                </div>

                <div className="flex flex-row relative rounded-2xl my-3 overflow-hidden">
                    <div className="object-cover size-40 bg-neutral-600 max-h-[160px] rounded-xl" />
                    <div
                        className={`
                                flex flex-col justify-start items-start px-3 gap-2
                                w-[calc(100%-160px)]
                            `}
                    ></div>
                </div>
                <div className="flex items-center justify-start flex-row gap-2">
                    <span className=" h-full flex items-center text-xs text-stone-400 "></span>
                </div>
            </div>
        </div>
    );
}

export function RatingCardSkeletonList({ count }: { count: number }) {
    return (
        <div
            className={`
                flex flex-col
                w-full divide-y divide-neutral-800
            `}
        >
            {Array.from({ length: count }).map((_, index) => (
                <RatingCardSkeleton key={index} />
            ))}
        </div>
    );
}
