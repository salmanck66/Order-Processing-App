import { Checkbox, Slider, Button, Divider, Collapse } from "antd";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

const FilterBox = ({
  selectedEditions,
  setSelectedEditions,

}) => {
  const editions = [
    "Fan Version",
    "Player Version",
    "First Copy Set",
    "Retro",
    "Kids set",
    "Sleeveless Training Set",
    "Basket Ball Set",
    "Basketball Master",
    "Default"
  ];  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleEditionChange = (checkedValues) => {
    setSelectedEditions(checkedValues);
  };




  return (
    <div className="p-4 shadow-2xl bg-accent rounded-lg my-4 mx-2 md:my-10 md:mx-4">
      {/* Toggle Bar for Smaller Screens */}
      <Collapse className="md:hidden" expandIconPosition="right">
        <Panel
          header="Filters"
          key="1"
        //   extra={<DownOutlined />}
          collapsible="header"
        >
          {/* Filter by Edition */}
          <div className="mt-2">
            <h1 className="text-sm font-thin mt-4">Editions</h1>
            <Divider className="mt-1 mb-2" />
            <Checkbox.Group
              options={editions}
              value={selectedEditions}
              className="flex flex-wrap gap-2"
              onChange={handleEditionChange}
            />
          </div>

          {/* Filter by Size */}
          

          {/* Filter by Price */}
         

          {/* Filter by Stock Availability */}
         
        </Panel>
      </Collapse>

      {/* Filters for Larger Screens */}
      <div className="hidden md:block">
        {/* Filter by Edition */}
        <h1 className="text-sm font-thin mt-4">Editions</h1>
        <Divider className="mt-1 mb-2" />
        <Checkbox.Group
          options={editions}
          value={selectedEditions}
          className="flex flex-wrap gap-2"
          onChange={handleEditionChange}
        />

        {/* Filter by Size */}
        <Divider className="mt-1 mb-2" />
       

      
       
      </div>
    </div>
  );
};

export default FilterBox;
