export const JobCardSkeleton = () => (
  <div className="card bg-base-100 shadow-sm animate-pulse">
    <div className="card-body">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-base-300" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-base-300 rounded w-3/4" />
          <div className="h-4 bg-base-300 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-6 bg-base-300 rounded w-20" />
        <div className="h-6 bg-base-300 rounded w-24" />
      </div>
    </div>
  </div>
);

export const ProfileCardSkeleton = () => (
  <div className="card bg-base-100 shadow-sm animate-pulse">
    <div className="card-body items-center text-center">
      <div className="w-20 h-20 rounded-full bg-base-300" />
      <div className="h-5 bg-base-300 rounded w-32 mt-2" />
      <div className="h-4 bg-base-300 rounded w-24" />
    </div>
  </div>
);

export const FeedSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <JobCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td><div className="h-4 bg-base-300 rounded w-32" /></td>
    <td><div className="h-4 bg-base-300 rounded w-24" /></td>
    <td><div className="h-4 bg-base-300 rounded w-20" /></td>
    <td><div className="h-4 bg-base-300 rounded w-16" /></td>
  </tr>
);
