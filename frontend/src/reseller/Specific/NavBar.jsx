import { Anchor, Avatar } from 'antd';
import React, { useState, useMemo, useCallback } from 'react';
import Title from '../Components/Title';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Memoize the heading array to avoid recalculating on every render
    const heading = useMemo(() => [
        { id: 1, name: 'Orders', label: '' },
        { id: 2, name: 'Products', label: 'Products' },
        { id: 3, name: 'Account', label: 'Account' },
    ], []);

    // Use useCallback to memoize the toggleMenu function
    const toggleMenu = useCallback(() => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
    }, []);

    return (
        <>
            <div className='bg-neutral mx-1 shadow-lg flex justify-between items-center rounded-2xl rounded-t-none min-h-14 px-4 md:px-20'>
                
                {/* Mobile Menu Toggle (Left) */}
                <div className='flex items-center md:hidden'>
                    <button onClick={toggleMenu} className='text-white'>
                        {isOpen ? <CloseOutlined /> : <MenuOutlined />}
                    </button>
                </div>

                {/* Title (Center) */}
                <div className='flex-1 flex justify-center md:justify-start'>
                    <Title />
                </div>
                
                {/* Notification Icon & Avatar (Right) */}
                <div className='flex items-center space-x-0 '>
                    <IoIosNotificationsOutline className='text-2xl p-1 rounded-full hover:shadow-2xl cursor-pointer hover:scale-105 md:me-10 bg-white ease-in  transition-all  ' />
                    <Avatar size={'small'} className='flex md:hidden' />
                </div>
                
                {/* Desktop Menu */}
                <div className='hidden md:flex space-x-3 ms-auto '>
                    {heading.map((item) => (
                        <Link 
                            key={item.id} 
                            to={`/reseller/${item.label.toLowerCase()}`} 
                            className='text-sm font-mono  px-4 p-1 shadow-xl  rounded-full bg-white hover:shadow-2xl hover:scale-105 ease-in  transition-all  '
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className='bg-neutral md:hidden flex flex-col space-y-2 p-4 rounded-lg mx-1 mt-2'>
                    {heading.map((item) => (
                        <Link 
                            key={item.id} 
                            
                            to={`/reseller/${item.label.toLowerCase()}`} 
                            onClick={() => setIsOpen(false)}
                            className='text-white'
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className='bg-secondary rounded-full h-10 flex items-center justify-between px-3'>
                        <h2>fahiz</h2>
                        <Avatar size={'small'} />
                    </div>
                </div>
            )}
        </>
    );
};

export default NavBar;
