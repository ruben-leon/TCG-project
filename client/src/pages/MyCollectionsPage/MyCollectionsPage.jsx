import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserDataContext from '../../contexts/UserDataContext';
import SuccessModalTextContext from '../../contexts/SuccessModalTextContext';
import TriggerSuccessModalContext from '../../contexts/TriggerSuccessModal';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import CollectionSummaryPlaceholder from '../../components/CollectionSummaryPlaceholder/CollectionSummaryPlaceholder';
import CollectionSummaryContainer from '../../components/CollectionSummaryContainer/CollectionSummaryContainer';
import AddCollectionButton from '../../components/AddCollectionButton/AddCollectionButton';
import AddCollectionModal from '../../components/AddCollectionModal/AddCollectionModal';
import ErrorAndSuccessModal from '../../components/ErrorAndSuccessModal/ErrorAndSuccessModal';
import './MyCollectionsPage.scss';

const MyCollectionsPage = () => {
  const navigate = useNavigate();

  const { userData, setUserData } = useContext(UserDataContext);
  const { successModalText } = useContext(SuccessModalTextContext);
  const { isMyCollectionsSuccessModalOpen } = useContext(
    TriggerSuccessModalContext
  );
  const { triggerSuccessModal } = useContext(TriggerSuccessModalContext);

  const [isLoading, setIsLoading] = useState(true);
  const [pokemonDataSingleCards, setPokemonDataSingleCards] = useState({});
  const [pokemonDataSealedProducts, setPokemonDataSealedProducts] = useState(
    {}
  );

  const [isAddCollectionModalOpen, setIsAddCollectionModalOpen] =
    useState(false);

  const toggleAddCollectionModal = () => {
    setIsAddCollectionModalOpen(!isAddCollectionModalOpen);
  };

  useEffect(() => {
    const generateCollectionsData = async () => {
      const user = JSON.parse(localStorage.getItem('user'));

      if (user === null) return navigate('/');

      const fetchUserData = await fetch(`/api/user/${user.data.user.email}`, {
        method: 'GET',
      });
      const data = await fetchUserData.json();
      setUserData(data);

      const singleCardsQueryStringArray = [];
      const sealedProductsQueryStringArray = [];

      data.collections.map((collection) => {
        return collection.collectionContent.singleCards.map((entry) => {
          return singleCardsQueryStringArray.push(`id:"${entry.id}"`);
        });
      });

      data.collections.map((collection) => {
        return collection.collectionContent.sealedProducts.map((entry) => {
          return sealedProductsQueryStringArray.push(`id:"${entry.id}"`);
        });
      });

      const singleCardsQueryString = singleCardsQueryStringArray.join(' OR ');
      const sealedProductsQueryString =
        sealedProductsQueryStringArray.join(' OR ');

      if (!singleCardsQueryString && !sealedProductsQueryString) {
        setIsLoading(false);
        return;
      }

      if (singleCardsQueryString) {
        const fetchPokemonDataSingleCards = await fetch(
          `https://api.pokemontcg.io/v2/cards?q=(${singleCardsQueryString})`,
          {
            method: 'GET',
          }
        );
        const pokemonDataSingleCards = await fetchPokemonDataSingleCards.json();
        setPokemonDataSingleCards(pokemonDataSingleCards);
      }

      if (sealedProductsQueryString) {
        const fetchPokemonDataSealedProducts = await fetch(
          `https://api.pokemontcg.io/v2/sealed?q=(${sealedProductsQueryString})`,
          {
            method: 'GET',
          }
        );
        const pokemonDataSealedProducts =
          await fetchPokemonDataSealedProducts.json();
        setPokemonDataSealedProducts(pokemonDataSealedProducts);
      }

      setIsLoading(false);
    };

    generateCollectionsData();
  }, []);

  useEffect(() => {
    if (isAddCollectionModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isAddCollectionModalOpen]);

  return isLoading ? null : (
    <div className="MyCollectionsPage">
      <Header />
      <div className="page-wrapper">
        <h1>My Collections</h1>
        {userData.collections.length === 0 ? (
          <CollectionSummaryPlaceholder
            toggleAddCollectionModal={toggleAddCollectionModal}
          />
        ) : (
          <CollectionSummaryContainer
            data={{
              userData,
              pokemonDataSingleCards,
              pokemonDataSealedProducts,
            }}
          />
        )}
        <div className="button-wrapper">
          <AddCollectionButton
            text={'Create new collection'}
            toggleAddCollectionModal={toggleAddCollectionModal}
          />
          {isAddCollectionModalOpen && (
            <AddCollectionModal
              isAddCollectionModalOpen={isAddCollectionModalOpen}
              toggleAddCollectionModal={toggleAddCollectionModal}
              toggleSuccessModal={triggerSuccessModal}
            />
          )}
          <Button text={'Search'} link={'search'} />
        </div>
      </div>
      {isMyCollectionsSuccessModalOpen ? (
        <ErrorAndSuccessModal
          customClassName="success-modal"
          easmText={successModalText}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyCollectionsPage;
