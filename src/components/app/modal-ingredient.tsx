import { useNavigate } from 'react-router-dom';

import { Modal, IngredientDetails } from '@components';

export const ModalIngredient = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
      <IngredientDetails />
    </Modal>
  );
};
