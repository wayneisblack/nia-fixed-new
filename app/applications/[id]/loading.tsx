import { SiteNav } from "../../../components/site-nav";
import { SiteFooter } from "../../../components/site-footer";
import { Skeleton } from "../../../components/ui/skeleton";

export default function ApplicationDetailLoading() {
  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-96 max-w-full" />
        <Skeleton className="mt-3 h-4 w-48" />

        <div className="mt-10 rounded-[1.75rem] border border-black/10 bg-white p-6 sm:p-8">
          <Skeleton className="h-4 w-16" />
          <div className="mt-5 flex gap-4">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>

        <div className="mt-6 rounded-[1.75rem] border border-black/10 bg-white p-6 sm:p-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-4 w-1/2" />
          <Skeleton className="mt-3 h-4 w-2/3" />
          <Skeleton className="mt-3 h-16 w-full" />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
