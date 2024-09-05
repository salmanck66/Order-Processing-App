import { useEffect, useState } from 'react';
import { fetchProducts } from '../../Api/getApi'; // Assuming you have a delete API function
import { Table, message, Button, Popconfirm, Input } from 'antd';
import { IoTrashOutline } from "react-icons/io5";
import { deleteMultipleProductsByIds, deleteProduct } from '../../Api/DeleteApi';
import ExpandProduct from './ExpandProduct';

const ListProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        setError(error);
        message.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleDeleteSelected = async () => {
    try {
      await deleteMultipleProductsByIds(selectedRowKeys);
      setProducts(products.filter((product) => !selectedRowKeys.includes(product._id)));
      setFilteredProducts(filteredProducts.filter((product) => !selectedRowKeys.includes(product._id)));
      setSelectedRowKeys([]);
      message.success('Selected products deleted successfully');
    } catch (error) {
      message.error('Failed to delete selected products');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product._id !== id));
      setFilteredProducts(filteredProducts.filter((product) => product._id !== id));
      message.success('Product deleted successfully');
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = products.filter(product => product.name.toLowerCase().includes(value.toLowerCase()));
    setFilteredProducts(filtered);
  };

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record._id] : []);
  };

  const columns = [
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
    },
    {
      title: 'Sizes Available',
      dataIndex: 'sizes',
      key: 'sizes',
      render: (sizes) => Object.keys(sizes).filter(size => sizes[size]).join(', '),
    },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (images) => <img className='size-20 object-cover rounded-md' src={images[0]?.url} alt="img" width={50} />,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this product?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="default" danger>
            <IoTrashOutline/>
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleTableChange = (page) => {
    setCurrentPage(page.current);
    setPageSize(page.pageSize);
  };

  const expandedRowRender = (record) => {
    return (
      <ExpandProduct record={record}/>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className=''>
      <div style={{ marginBottom: 16 }} className='w-full flex justify-end px-0 p-2'>
        <Input.Search
          placeholder="Search by product name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
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
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredProducts}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: filteredProducts.length,
          showSizeChanger: true,
          onChange: handleTableChange,
        }}
        expandedRowRender={expandedRowRender}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpand}
      />
    </div>
  );
};

export default ListProducts;
