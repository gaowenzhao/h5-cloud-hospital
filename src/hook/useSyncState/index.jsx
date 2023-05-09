import { useEffect, useState, useRef } from "react";
/**通过回调函数，同步获取useState的最新状态值*/
function useSyncState(state) {
  const cbRef = useRef();
  const [data, setData] = useState(state);

  useEffect(() => {
    cbRef.current && cbRef.current(data);
  }, [data]);

  return [
    data,
    function (val, callback) {
      cbRef.current = callback;
      setData(val);
      if (val === data) {
        cbRef.current && cbRef.current(data);
      }
    },
  ];
}

export default useSyncState;
