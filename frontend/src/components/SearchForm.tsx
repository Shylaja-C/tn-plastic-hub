'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { value: 'internships',      label: 'Internships' },
  { value: 'schemes',          label: 'Schemes' },
  { value: 'companies',        label: 'Companies' },
];

export function SearchForm() {
  const router = useRouter();
  const [category, setCategory] = useState('internships');
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : '';
    router.push(`/${category}${params}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-lg">
      {/* Category select */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="h-10 rounded-md border border-input bg-white px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring shrink-0"
        aria-label="Search category"
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      {/* Text input */}
      <Input
        type="search"
        placeholder="Job title, scheme name, company…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 bg-white"
        aria-label="Search query"
      />

      {/* Orange search button */}
      <Button
        type="submit"
        className="bg-accent hover:bg-accent/90 text-white shrink-0 gap-1.5"
      >
        <Search className="h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
