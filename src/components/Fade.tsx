import { Dispatch, FC, ReactNode, SetStateAction, useEffect, useState } from "react"

export const Fade: FC<{
  defaultVisible?: boolean
  children: ReactNode
  visibleNode: ReactNode,
  onChange?: (visible: boolean, setVisible: Dispatch<SetStateAction<boolean>>) => void
  onClick?: (visible: boolean) => void
}> = ({children,onChange, onClick, visibleNode,defaultVisible = false}) => {
  const [visible, setVisible] = useState(defaultVisible)
  const className = 'transition-all duration-500 left-0 top-0 '

  useEffect(() => {
    onChange?.(visible, setVisible)
  }, [onChange, visible])

  return <>
    <div className={`${visible ? 'opacity-100' : 'opacity-0 absolute -z-10'} ${className}`} onClick={() => {
      onClick?.(false)
      setVisible(false)
    }}>
      {visibleNode}
    </div>
    <div className={`${!visible ? 'opacity-100' : 'opacity-0 absolute -z-10'} ${className}`} onClick={() => {
      onClick?.(true)
      setVisible(true)
    }}>
      {children}
    </div>
  </>
}