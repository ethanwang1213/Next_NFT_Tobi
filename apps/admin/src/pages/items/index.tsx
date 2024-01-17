import { Metadata } from 'next';
// import Table from '@/app/ui/invoices/table';
import CreateButton from 'ui/atoms/create-button';
import { ItemsManageTab } from 'ui/organisms/admin/items-tab'
// import { lusitana } from '@/app/ui/fonts';
// import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
// import { Suspense } from 'react';
// import { fetchInvoicesPages } from '@/app/lib/data';

export const metadata: Metadata = {
  title: 'アイテム管理',
};

export default function Index() {
    // const query = searchParams?.query || '';
    // const currentPage = Number(searchParams?.page) || 1;

    // const totalPages = await fetchInvoicesPages(query);
    
    return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        <h1 className="page-title mt-8 ml-12">アイテム管理</h1>
        <CreateButton buttonLabel='NEW SAMPLE' linkAddress="/admin/itmes/create" />
      </div>
      <div className="w-full items-center justify-between">
        <ItemsManageTab />
      </div>
    </div>
  );
}