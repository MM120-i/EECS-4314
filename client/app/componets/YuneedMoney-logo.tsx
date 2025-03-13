""
import Image from 'next/image';
import { poppins } from '@/app/componets/fonts';

export default function YuNeedMoneyLogo({text_color}: {text_color:string}){
    return (
        <div className={`${poppins.className} flex items-center space-x-2 text-logo px-4`}>
          <Image src="/logo.png" alt={"dummy logo"} width={56} height={56}/>
          <p className={`text-[30px] text-${text_color}`}>YUNeedMoney</p>
          
        </div>
    );
}