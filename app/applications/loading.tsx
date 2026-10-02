import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Skeleton, SkeletonList } from "../../components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-10 w-72 max-w-full" />
        <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        <div className="mt-10">
          <SkeletonList count={5} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
