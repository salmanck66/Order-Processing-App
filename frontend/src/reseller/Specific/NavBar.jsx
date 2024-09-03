import { Anchor, Avatar } from 'antd';
import React, { useState } from 'react';
import Title from '../Components/Title';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const heading = [
        { id: 1, name: 'Orders' },
        { id: 2, name: 'Products' },
        { id: 3, name: 'Account' },
    ];

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className='bg-neutral mx-1  shadow-lg flex justify-between items-center rounded-2xl rounded-t-none h-12 px-4 md:px-20'>
                
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
                
                {/* Shopping Bag Icon & Avatar (Right) */}
                <div className='flex items-center space-x-4'>
                    <IoIosNotificationsOutline className='text-2xl text-white md:me-10' />
                    <Avatar size={'small'} className='flex md:hidden' />
                </div>
                
                {/* Desktop Menu */}
                <div className='hidden md:flex space-x-6 ms-auto me-10'>
                    {heading.map(item => (
                        <Link key={item.id} to={`/reseller/${item.name.toLowerCase()}`} className='text-sm font-mono text-white'>
                            {item.name}
                        </Link>
                    ))}
                </div>
                
                {/* User Info (Desktop Only) */}
               
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className='bg-neutral md:hidden flex flex-col space-y-2 p-4 rounded-lg mx-1 mt-2'>
                    {heading.map(item => (
                        <a key={item.id} href={`/${item.name.toLowerCase()}`} className='text-white'>
                            {item.name}
                        </a>
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
