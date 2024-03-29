import {FC, ReactNode } from 'react';
import '../styles/components.css'

interface props{
  children:ReactNode
}

const Container:FC<props> = ({children}) =>{
  return (
    <>
    <div className="container">
      {children}
    </div>
  </>
)}

export default Container