import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from 'ui/atoms/utils';

export default function PackageTable() {
  const packages = [
    {
      "id": 1,
      "image_url": "/admin/images/package-thumnail/Gorakuba.png",
      "name": "THE TITLE OF A PACKAGE", 
      "publish_setting": "公開中", 
      "release_date": "2023/05/14 13:24",
      "count": 9,
     },
     { 
      "id": 2,
      "image_url": "/admin/images/package-thumnail/Gorakuba.png",
      "name": "THE TITLE OF A PACKAGE", 
      "publish_setting": "公開中", 
      "release_date": "2023/05/14 13:24",
      "count": 9,
     },
     { 
      "id": 3,
      "image_url": "/admin/images/package-thumnail/Gorakuba.png",
      "name": "THE TITLE OF A PACKAGE", 
      "publish_setting": "公開中", 
      "release_date": "2023/05/14 13:24",
      "count": 9,
     },
     { 
      "id": 4,
      "image_url": "/admin/images/package-thumnail/Gorakuba.png",
      "name": "THE TITLE OF A PACKAGE", 
      "publish_setting": "公開中", 
      "release_date": "2023/05/14 13:24",
      "count": 9,
     },
  ];

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                パッケージ名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                公開設定
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                公開日
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                アイテム数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {packages?.map((package_item) => (
                <tr
                  key={package_item.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={package_item.image_url}
                        className="rounded-full"
                        width={260}
                        height={85}
                        alt={`${package_item.name}'s profile picture`}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {package_item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {package_item.publish_setting}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {formatDateToLocal(sample.release_date)} */}
                    {package_item.release_date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {(package_item.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
