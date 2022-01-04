import { Badge } from '@mui/material';
import { useDispatch } from 'react-redux';
import { RemovePfpIconButton, StyledCloseIcon, UserAvatar, StyledAccountCircle } from './Auth/Register/helpers';

interface PfpProps {
    setPfp: (pfp: File | null) => any;
}

type PfpPropsWithRemove = PfpProps & { pfp: File | null };

export const PfpWithRemoveButton: React.FC<PfpPropsWithRemove> = ({ pfp, setPfp }) => {
    return (
        <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
                <RemovePfpIconButton onClick={() => setTimeout(() => setPfp(null), 100)}>
                    <StyledCloseIcon />
                </RemovePfpIconButton>
            }
        >
            <UserAvatar src={pfp ? URL.createObjectURL(pfp) : undefined} />
        </Badge>
    );
};

export const PfpInput: React.FC<PfpProps> = ({ setPfp }) => {
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        if (!ev.target.files || !ev.target.files[0]) {
            return setPfp(null);
        }

        const file = ev.target.files[0];
        setPfp(file);
    };

    return (
        <>
            <StyledAccountCircle />
            <input
                accept="image/*"
                type="file"
                hidden
                onChange={handleChange}
                style={{ width: '10rem', height: '10rem', color: '#353535' }}
            />
        </>
    );
};
