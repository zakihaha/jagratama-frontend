'use client';

import { Funnel, Search, UserPlus } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '../ui/button/Button';
import Select from '../form/Select';
import { PositionModel } from '@/types/position';
import UserCreateForm from '@/app/jagratama/users/create/UserCreateForm';
import { RoleModel } from '@/types/role';

export default function SearchInputUsers({ showStatusFilter = true, positions, roles }: { showStatusFilter?: boolean, positions: PositionModel[], roles: RoleModel[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTitle = searchParams.get('name') || '';
  const initialPosition = searchParams.get('position') || '';
  const [searchTerm, setSearchTerm] = useState(initialTitle);
  const [position, setPosition] = useState(initialPosition);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  // Sync state with URL param on initial load or if URL changes externally
  useEffect(() => {
    setSearchTerm(initialTitle);
    setPosition(initialPosition);
  }, [initialTitle, initialPosition]);

  const positionOptions = [
    { value: 0, label: 'Semua Jabatan' },
    ...positions.map((position) => ({
      value: position.id,
      label: position.name,
    })),
  ];
  const handlePosition = (value: string) => {
    setPosition(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentParams = new URLSearchParams(searchParams.toString());

    // Handle search term filtering
    if (searchTerm) {
      currentParams.set('name', searchTerm);
    } else {
      currentParams.delete('name');
    }
    // Handle position filtering
    if (position) {
      currentParams.set('position', position);
    } else {
      currentParams.delete('position')
    }
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <>
      <Button
        onClick={openModal}
        size="sm"
        variant="primary"
        className="!bg-[#20939C]"
      >
        Tambah
        <UserPlus className="w-4 h-4" />
      </Button>

      <form onSubmit={handleSearch} className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {
          showStatusFilter && (
            <div className="relative">
              <Select
                options={positionOptions}
                placeholder="Pilih jabatan"
                name="position_id"
                id="position_id"
                className="dark:bg-dark-900 pl-12 rounded-[8px] text-[#262626] placeholder:!text-[#A1A1A1] !text-sm font-normal"
                defaultValue={position}
                onChange={handlePosition}
              />
              <Funnel className="absolute top-3 left-4 text-[#A1A1A1]" />
            </div>
          )
        }
        <div className="relative flex gap-4">
          <input
            className="rounded-[8px] border border-gray-300 focus-visible:border-brand-300 focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10 text-[#262626] py-[10px] pl-12 pr-4 placeholder:text-[#A1A1A1] text-sm font-normal"
            placeholder="Cari pengguna"
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            name="name"
            id="name"
            value={searchTerm}
          />
          <Search className="absolute top-3 left-4 text-[#A1A1A1]" />
          <Button type='submit' className="!bg-[#20939C]">
            Search
            <Search />
          </Button>
        </div>
      </form>

      {isModalOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-6 max-w-[600px] w-full shadow-xl relative backdrop-blur-sm">
            <div className="flex flex-col gap-1">
              <p className="text-[#262626] text-base font-medium">Tambah User</p>
              <p className="text-[#737373] text-sm">Masukan data pengguna Jagratama</p>
            </div>
            <hr className="my-[30px]" />
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✕
            </button>

            <UserCreateForm
              roles={roles}
              positions={positions}
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
