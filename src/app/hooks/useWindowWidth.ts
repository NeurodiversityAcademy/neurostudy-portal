import { useEffect } from 'react';
import { throttle } from '../utilities/common';
import { useAppSelector } from '../redux/store';
import { useDispatch } from 'react-redux';
import { setWindowWidth } from '../redux/features/window/window.slice';

const useWindowWidth = (): number => {
  const windowWidth = useAppSelector(
    (state) => state.windowReducer.windowWidth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setWindowWidth(window.innerWidth));

    const updateWidth = throttle(() => {
      dispatch(setWindowWidth(window.innerWidth));
    });

    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, [dispatch]);

  return windowWidth;
};

export default useWindowWidth;
