import Image from 'next/image';
import { formatDateToLocal, formatCurrency } from 'ui/atoms/utils';

export default function SampleTable() {
  const samples = [
    {
      "id": 1,
      "image_url": "/admin/images/sample-thumnail/Rectangle-61.png",
      "name": "Inutanuki - GORAKUBA!", 
      "position": "Highschool",
      "amount": 1500, 
      "publish_setting": "公開中", 
      "sales_status": "販売中", 
      "release_date": "2023/05/14 13:24",
      "sales_start_date": "2023/05/14 13:24",
      "sales_end_date": "2023/05/14 13:24",
     },
     { 
      "id": 2,
      "image_url": "/admin/images/sample-thumnail/Rectangle-58.png",
      "name": "Pento - GORAKUBA!", 
      "position": "Highschool",
      "amount": 1500, 
      "publish_setting": "公開中", 
      "sales_status": "販売終了", 
      "release_date": "2023/05/14 13:24",
      "sales_start_date": "2023/05/14 13:24",
      "sales_end_date": "2023/05/14 13:24",
     },
     { 
      "id": 3,
      "image_url": "/admin/images/sample-thumnail/Rectangle-60.png",
      "name": "Encho. - GORAKUBA! ", 
      "position": "Highschool",
      "amount": 1500, 
      "publish_setting": "非公開", 
      "sales_status": "", 
      "release_date": "",
      "sales_start_date": "",
      "sales_end_date": "",
     },
     { 
      "id": 4,
      "image_url": "/admin/images/sample-thumnail/Rectangle-59.png",
      "name": "Tenri Kannagi 2023", 
      "position": "",
      "amount": 2500, 
      "publish_setting": "予約公開", 
      "sales_status": "", 
      "release_date": "2023/05/14 13:24",
      "sales_start_date": "2023/05/14 13:24",
      "sales_end_date": "2023/05/14 13:24",
     },
     {
      "id": 5,
      "image_url": "/admin/images/sample-thumnail/Rectangle-61.png",
      "name": "SAMPLEITEM1234", 
      "position": "",
      "amount": 0, 
      "publish_setting": "下書き", 
      "sales_status": "", 
      "release_date": "",
      "sales_start_date": "",
      "sales_end_date": "",
     },
     {
      "id": 6,
      "image_url": "/admin/images/sample-thumnail/Rectangle-61.png",
      "name": "SAMPLEITEM1235", 
      "position": "",
      "amount": 0, 
      "publish_setting": "下書き", 
      "sales_status": "", 
      "release_date": "",
      "sales_start_date": "",
      "sales_end_date": "",
     },
     {
      "id": 7,
      "image_url": "/admin/images/sample-thumnail/Rectangle-61.png",
      "name": "SAMPLEITEM1236", 
      "position": "",
      "amount": 0, 
      "publish_setting": "下書き", 
      "sales_status": "", 
      "release_date": "",
      "sales_start_date": "",
      "sales_end_date": "",
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
                アイテム名
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                金額
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                公開設定
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                販売状況
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                公開日
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                販売開始日
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                販売終了日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {samples?.map((sample) => (
                <tr
                  key={sample.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={sample.image_url}
                        className="rounded-full"
                        width={80}
                        height={80}
                        alt={`${sample.name}'s profile picture`}
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <p>{sample.name}</p>{sample.position}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {formatCurrency(sample.amount)} */}
                    {sample.amount}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sample.publish_setting}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {sample.sales_status}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {/* {formatDateToLocal(sample.release_date)} */}
                    {sample.release_date}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {(sample.sales_start_date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {(sample.sales_end_date)}
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
