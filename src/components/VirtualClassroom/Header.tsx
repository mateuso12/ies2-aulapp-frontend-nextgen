import React from 'react'
import {
  ArrowLeft,
  SearchNormal,
  Timer,
  RefreshCircle,
  Menu,
} from 'iconsax-react'

export const Header: React.FC = () => {
  return (
    <header className="flex h-[88px] w-full items-center justify-between bg-white px-8 shadow-sm">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-4">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
          <ArrowLeft size="24" color="currentColor" variant="Linear" />
        </button>
        <h1 className="font-sans text-2xl font-semibold text-[#FF246E]">
          4.2 <span className="text-[#FF246E]">Nome da Aula</span>
        </h1>
      </div>

      {/* Center: Controls */}
      <div className="flex items-center gap-4">
        {/* Exercise List Button */}
        <button className="flex h-[26px] items-center justify-center rounded bg-[#FBE7E4] px-2 text-sm font-medium text-[#FF246E] hover:bg-[#fad1cc]">
          Lista de Exercícios
        </button>

        {/* Search */}
        <div className="flex h-8 w-[487px] items-center rounded bg-[#F5F7FB] px-4 text-[#FF246E]">
          <SearchNormal size="16" color="currentColor" variant="Linear" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="ml-2 w-full bg-transparent text-sm text-gray-600 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 rounded-full border border-[#FFB6B6] bg-white px-4 py-2 text-[#FF246E]">
          <Timer size="20" color="currentColor" variant="Bold" />
          <span className="font-sans text-base font-bold text-[#343A40]">
            05:21
          </span>
        </div>

        {/* Refresh */}
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
          <RefreshCircle size="24" color="currentColor" variant="Bold" />
        </button>
      </div>

      {/* Right: Menu */}
      <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF246E] hover:bg-gray-100">
        <Menu size="24" color="currentColor" variant="Linear" />
      </button>
    </header>
  )
}
