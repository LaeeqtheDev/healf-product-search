export function Pagination() {
    return (
      <nav className="flex items-center justify-between border-t border-sage-100 pt-4">
        <button className="rounded-md border border-sage-100 px-4 py-2 text-sm">
          ← Previous
        </button>
  
        <span className="text-sm text-sage-600">
          Page 1 of 1
        </span>
  
        <button className="rounded-md border border-sage-100 px-4 py-2 text-sm">
          Next →
        </button>
      </nav>
    );
  }