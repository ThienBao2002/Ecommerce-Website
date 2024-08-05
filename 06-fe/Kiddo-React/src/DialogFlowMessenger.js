import React, { useEffect } from 'react';

const DialogFlowMessenger = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <df-messenger
      chat-icon="https:&#x2F;&#x2F;cdn-icons-png.flaticon.com&#x2F;512&#x2F;2899&#x2F;2899298.png"
      chat-title="Hỗ trợ Kiddo"
      agent-id="99eae6b8-88a3-4642-b03e-31558bf669d1"
      language-code="vi"
    ></df-messenger>
  );
};

export default DialogFlowMessenger;