export function SearchBar({value, onChange}:{value: string, onChange: (value:string)=> void}) {
    return(
        <div>
            <label htmlFor="search" className="sr-only">Search</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                name="search"
                placeholder="Search Supplements, brands, ingredients"
                aria-label="Search products"
                className="w-full rounded-lg border border-sage-100 bg-white px-4 py-3 pr-10 text-sm text-ink outline-none transition placeholder:text-sage-600 focus:border-sage-600 focus:ring-2 focus:ring-sage-600/20"
            />

           {value && ( 
           <button onClick={() => onChange("")}
           aria-label="Clear search"
           className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-600 transition hover:text-ink"
           >
                X
            </button>
            )}
        </div>
    )
}