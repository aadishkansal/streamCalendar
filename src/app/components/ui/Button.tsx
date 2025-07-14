
import Image from 'next/image'
import React from 'react'
type ButtonProps={
  type:'button' | 'submit',
  title:string,
  icon?:string,
  variant?:'btn_purple'|'btn_big1' | 'btn_big2',
  className?: string,
  onClick:() => void;
  disabled?:boolean,

}
const Button = ({type, title, icon,variant,className,onClick,disabled=false} : ButtonProps) => {
  return (
<button  
className={`
  rounded-full flex gap-3 justify-center items-center border
  ${variant} ${className ?? ''}
  ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
`}
type={type}
onClick={onClick}
disabled={disabled}
>
  {icon && <Image src={icon} alt={title} width={24} height={24} />}
  <label className="whitespace-nowrap font-semibold font-['inter']" >{title}</label>
</button>
  )
}

export default Button
