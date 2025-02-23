import Image from 'next/image';
import { poppins } from '@/app/componets/fonts';

export default function YuNeedMoneyLogo(){
    return (
        <div className={`${poppins.className} flex items-center space-x-2 text-logo px-4`}>
          <Image src="/dummy_logo.svg" alt={"dummy logo"} width={56} height={56}/>
          <p className="text-[30px]">YUNeedMoney</p>
        </div>
    );
}