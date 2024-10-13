import React, { useState } from "react";

function Tabs({ data, onTabChange, defaultActiveId }) {
  const [activeTab, setActiveTab] = useState(defaultActiveId);

  function changeTabOnClick(id) {
    setActiveTab(id);
    if (onTabChange) onTabChange(id);
  }

  return (
    <>
      <TabHeader
        data={data}
        onTabTriggerClick={changeTabOnClick}
        activeId={activeTab}
      />
      <TabContent data={data} activeId={activeTab} />
    </>
  );
}

function TabHeader({ data, onTabTriggerClick, activeId }) {
  return (
    <div
      className="w-full grid grid-cols-2 p-2 bg-slate-100 rounded-md"
      style={{
        backgroundColor: "rgb(241 245 249)",
      }}
    >
      {data.map((item) => (
        <button
          className="py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow"
          onClick={() => onTabTriggerClick(item.id)}
          data-state={activeId === item.id ? "active" : "inactive"}
          style={{
            backgroundColor: activeId === item.id ? "white" : "transparent",
          }}
        >
          <span>{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function TabContent({ data, activeId }) {
  return (
    <div className="mt-4">
      {data.map((item) => (
        <div className={activeId === item.id ? "block" : "hidden"}>
          {item.content}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
