import { setModalState } from '@/redux/homePage/actions';
import { PeopleAlt, PersonAdd } from '@mui/icons-material';
import { SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { useDispatch } from 'react-redux';
import { StyledSpeedDial } from './helpers';

const HomeSpeedDial = () => {
    const dispatch = useDispatch();

    return (
        <StyledSpeedDial ariaLabel="Add new" color="primary" icon={<SpeedDialIcon />}>
            <SpeedDialAction
                onClick={() => dispatch(setModalState('create-room'))}
                key="create room"
                icon={<PeopleAlt />}
                tooltipTitle="Create a room"
            />
            <SpeedDialAction
                onClick={() => dispatch(setModalState('add-friend'))}
                key="add friend"
                icon={<PersonAdd />}
                tooltipTitle="Add a friend"
            />
        </StyledSpeedDial>
    );
};

export default HomeSpeedDial;
