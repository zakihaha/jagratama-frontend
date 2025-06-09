'use client';

import { Funnel, Search } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '../ui/button/Button';
import Select from '../form/Select';

export default function SearchInput({ showStatusFilter = true }: { showStatusFilter?: boolean }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTitle = searchParams.get('title') || '';
  const initialStatus = searchParams.get('status') || '';
  const [searchTerm, setSearchTerm] = useState(initialTitle);
  const [status, setStatus] = useState(initialStatus);

  // Sync state with URL param on initial load or if URL changes externally
  useEffect(() => {
    setSearchTerm(initialTitle);
    setStatus(initialStatus);
  }, [initialTitle, initialStatus]);

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Ditolak' },
  ];

  const handleStatus = (value: string) => {
    setStatus(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams.toString());

    // Handle search term filtering
    if (searchTerm) {
      currentParams.set('title', searchTerm);
    } else {
      currentParams.delete('title');
    }
    // Handle status filtering
    if (status && status !== 'all') {
      currentParams.set('status', status);
    } else {
      currentParams.delete('status');
    }
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      {
        showStatusFilter && (
          <div className="relative">
            <Select
              options={statusOptions}
              placeholder="Pilih Status"
              name="category_id"
              id="category_id"
              className="dark:bg-dark-900 pl-12 rounded-[8px] text-[#262626] placeholder:!text-[#A1A1A1] !text-sm font-normal"
              defaultValue={status}
              onChange={handleStatus}
            />
            <Funnel className="absolute top-3 left-4 text-[#A1A1A1]" />
          </div>
        )
      }
      <div className="relative flex gap-4">
        <input
          className="rounded-[8px] border border-gray-300 focus-visible:border-brand-300 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10 text-[#262626] py-[10px] pl-12 pr-4 placeholder:text-[#A1A1A1] text-sm font-normal"
          placeholder="Cari Dokumen"
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          name="title"
          id="title"
          value={searchTerm}
        />
        <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
        <Button type='submit'>
          Search
          <Search className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
