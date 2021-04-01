/// <reference types="next" />
/// <reference types="next/types/global" />


declare module "*.png"
declare module "*.svg"


export interface NFTProps {
  id: number,
  type: string
  img: string
  avatar_url: string
  username: string,
  title: string
  time: string|number
}