import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { fetchProducts } from '../../Api/getApi';
import { Table, message, Button, Popconfirm } from 'antd';
import { IoTrashOutline } from "react-icons/io5";
import { deleteMultipleProductsByIds, deleteProduct } from '../../Api/DeleteApi';
import ExpandProduct from './ExpandProduct';
import debounce from 'lodash.debounce';

const ListProducts = ({ searchText }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const loadProducts = useCallback(async (query) => {
        setLoading(true);
        try {
            const data = await fetchProducts(query);
            setProducts(data.products);
        } catch (error) {
            setError(error);
            message.error('Failed to load products.');
        } finally {
            setLoading(false);
        }
    }, []);

    const debouncedLoadProducts = useCallback(debounce((query) => loadProducts(query), 500), [loadProducts]);

    useEffect(() => {
        debouncedLoadProducts(searchText);
    }, [searchText, debouncedLoadProducts]);

    const handleDeleteSelected = useCallback(async () => {
        try {
            await deleteMultipleProductsByIds(selectedRowKeys);
            setProducts(products.filter((product) => !selectedRowKeys.includes(product._id)));
            setSelectedRowKeys([]);
            message.success('Selected products deleted successfully');
        } catch (error) {
            message.error('Failed to delete selected products');
        }
    }, [selectedRowKeys, products]);

    const handleDelete = useCallback(async (id) => {
        try {
            await deleteProduct(id);
            setProducts(products.filter((product) => product._id !== id));
            message.success('Product deleted successfully');
        } catch (error) {
            message.error('Failed to delete product');
        }
    }, [products]);

    const handleExpand = useCallback((expanded, record) => {
        setExpandedRowKeys(expanded ? [record._id] : []);
    }, []);

    const handleRowClick = useCallback((record) => {
        setExpandedRowKeys((prev) =>
            prev.includes(record._id) ? [] : [record._id]
        );
    }, []);

    const updateProduct = useCallback((updatedProduct) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            )
        );
    }, []);

    const columns = useMemo(() => [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'images',
            render: (images) => <img className='size-20 object-cover rounded-md' src={images[0]?.url} alt="img" width={50} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Edition',
            dataIndex: 'edition',
            key: 'edition',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `$${price}`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
            render: (stock) => (stock ? 'In Stock' : 'Out of Stock'),
            responsive: ['sm']
        },
        {
            title: 'Sizes Available',
            dataIndex: 'sizes',
            key: 'sizes',
            render: (sizes) => Object.keys(sizes).filter(size => sizes[size]).join(', '),
        },
        
        {
            title: '',
            key: 'action',
            responsive: ['sm'],
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this product?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="default" danger>
                        <IoTrashOutline />
                    </Button>
                </Popconfirm>
            ),
        },
    ], [handleDelete]);

    const rowSelection = useMemo(() => ({
        selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
            setSelectedRowKeys(newSelectedRowKeys);
        },
    }), [selectedRowKeys]);

    const expandedRowRender = useCallback(
        (record) => <ExpandProduct record={record} onProductUpdate={updateProduct} />,
        [updateProduct]
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            {selectedRowKeys.length > 0 && (
                <Popconfirm
                    title="Are you sure you want to delete the selected products?"
                    onConfirm={handleDeleteSelected}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger style={{ marginBottom: 16 }}>
                        Delete Selected
                    </Button>
                </Popconfirm>
            )}
           <div className="table-container">
  <Table
  scroll={{ x: 'max-content' }} // Horizontal scrolling for the table
  rowSelection={rowSelection}
    columns={columns}
    dataSource={products}
    rowKey="_id"
    expandedRowKeys={expandedRowKeys}
    onExpand={handleExpand}
    onRow={(record) => ({
      onClick: () => handleRowClick(record),
    })}
    expandedRowRender={expandedRowRender}
  />
</div>

        </div>
    );
};

export default ListProducts;
