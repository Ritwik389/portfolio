import Link from "next/link";

export default function NotFound() {
  return (
    <main className="oom">
      <pre className="oom-trace" aria-hidden="true">{`Traceback (most recent call last):
  File "router.py", line 404, in resolve
    page = allocate(request.path)
torch.cuda.OutOfMemoryError: CUDA out of memory.
Tried to allocate a page that does not exist.`}</pre>
      <h1>404 · this page was never allocated</h1>
      <p>Probably a typo, possibly a stale link. The kernel is fine; the page isn’t.</p>
      <Link className="btn btn-primary" href="/">
        torch.cuda.empty_cache() and go home
      </Link>
    </main>
  );
}
