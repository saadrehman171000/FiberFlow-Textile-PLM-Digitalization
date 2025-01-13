
import { Search, Bell, Sun, Moon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dispatch, SetStateAction, useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Switch } from './ui/switch'

type Props = {
  isDarkMode: boolean,
  setIsDarkMode: Dispatch<SetStateAction<boolean>>
}

const Header = ({ isDarkMode, setIsDarkMode }: Props) => {
  const [notifications] = useState([
    { id: 1, message: 'Your order has been shipped', details: 'Order #1234 - Estimated delivery: 3 days' },
    { id: 2, message: 'New product available', details: 'Check out our latest collection!' },
    { id: 3, message: 'Your review has been approved', details: 'Thank you for your feedback!' }
  ])


  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">FiberFlow</h1>
        </div>
        <div className="flex items-center space-x-4">
          <form className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 w-[200px] lg:w-[300px] rounded-full border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map(notification => (
                <DropdownMenuItem key={notification.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{notification.message}</span>
                    <span className="text-sm text-gray-500">{notification.details}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton />
          <div className="flex items-center space-x-2">
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              className="bg-gray-200 dark:bg-gray-700"
            />
            {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
