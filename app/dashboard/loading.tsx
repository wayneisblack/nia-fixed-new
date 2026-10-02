import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Skeleton, SkeletonStatGrid, SkeletonList } from "../../components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />

        <div className="mt-10">
          <SkeletonStatGrid count={3} />
        </div>

        <div className="mt-12">
          <Skeleton className="h-7 w-48" />
          <div className="mt-6">
            <SkeletonList count={3} />
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
