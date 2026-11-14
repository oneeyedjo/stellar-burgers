import { useNavigate, useParams } from 'react-router-dom';

import { Modal, OrderInfo } from '@components';

export const ModalOrderInfo = (): React.JSX.Element => {
  const navigate = useNavigate();
  const { number } = useParams();

  return (
    <Modal title={`Заказ #${number}`} onClose={() => navigate(-1)}>
      <OrderInfo />
    </Modal>
  );
};
