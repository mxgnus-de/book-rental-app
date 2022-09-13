import { CircularProgress } from '@mui/material';
import styled from 'styled-components';

interface LoadingProps {
	size?: number;
}

export function LoadingSpinner({ size }: LoadingProps) {
	return <CircularProgress color="secondary" size={size} />;
}

export function WrappedLoadingSpinner({ size }: LoadingProps) {
	return (
		<SpinnerWrapper>
			<LoadingSpinner size={size} />
		</SpinnerWrapper>
	);
}

const SpinnerWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
`;
