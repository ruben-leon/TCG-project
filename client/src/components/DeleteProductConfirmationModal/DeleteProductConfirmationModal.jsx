import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import UserDataContext from '../../contexts/UserDataContext';
import SuccessModalTextContext from '../../contexts/SuccessModalTextContext';
import './DeleteProductConfirmationModal.scss';

const DeleteProductConfirmationModal = ({
  scrollY,
  content,
  sealedProductData,
  toggleDeleteProductConfirmationModal,
  toggleEditSealedProductModal,
  toggleSuccessModal,
}) => {
  const params = useParams();

  const { setUserData } = useContext(UserDataContext);
  const { setSuccessModalText } = useContext(SuccessModalTextContext);

  const handleDeleteProduct = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchUserData = await fetch(`/api/user/${user.data.user.email}`, {
      method: 'GET',
    });
    const data = await fetchUserData.json();

    const collectionIndex = data.collections.findIndex(
      (entry) => entry.collectionName.toLowerCase() === params.id.toLowerCase()
    );

    const entryIndex = data.collections[
      collectionIndex
    ].collectionContent.sealedProducts.findIndex(
      (entry) => entry.entryId === content.entryId
    );

    data.collections[collectionIndex].collectionContent.sealedProducts.splice(
      entryIndex,
      1
    );

    await fetch(`/api/user/${user.data.user.email}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setUserData(data);
    setSuccessModalText(
      <p>
        <span style={{ fontWeight: 700 }}>
          {sealedProductData.name} ({sealedProductData.set.name})
        </span>{' '}
        successfully removed from collection{' '}
        <span style={{ fontWeight: 700 }}>{params.id}</span>!
      </p>
    );
    toggleDeleteProductConfirmationModal();
    toggleEditSealedProductModal();
    toggleSuccessModal();
  };

  return (
    <div className="DeleteProductConfirmationModal" style={{ top: scrollY }}>
      <div className="dpcm-confirmation-content">
        <p>Are you sure you want to delete {sealedProductData.name}?</p>
        <button
          className="delete-button"
          onClick={() => {
            handleDeleteProduct();
          }}
        >
          Delete product
        </button>
        <button
          className="Button"
          onClick={() => {
            toggleDeleteProductConfirmationModal();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteProductConfirmationModal;
