import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import dayjs from 'dayjs';

interface AllTodoListInterface {
    searchResultClickEvt: (id: string) => void;
}

interface FilterListInterface {
    name: string;
    value: string;
}

const FILTER_LIST: FilterListInterface[] = [
    {
        name: '전체',
        value: 'all'
    },
    {
        name: '종료 일정',
        value: 'end'
    },
    {
        name: '진행 일정',
        value: 'ongoing'
    },
];

const AllTodoList: React.FC<AllTodoListInterface> = ({ searchResultClickEvt }) => {
    const myTodoList = useSelector((state: RootState) => state.date.myTodoList);

    const [filter, setFilter] = useState<Array<any>>(FILTER_LIST.map(f => f.value));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [todoList, setTodolist] = useState<Array<any>>(myTodoList);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCheck = (value: string, isChecked: boolean) => {
        if (value === 'all') {
            setFilter(isChecked ? FILTER_LIST.map(f => f.value) : []);
        } else {
            setFilter((prevFilter) => {
                const newFilter = isChecked
                    ? [...prevFilter, value]
                    : prevFilter.filter(f => f !== value);

                if (newFilter.length === FILTER_LIST.length - 1 && !newFilter.includes('all')) {
                    return [...newFilter, 'all'];
                }

                if (newFilter.includes('all') && !isChecked) {
                    return newFilter.filter(f => f !== 'all');
                }

                return newFilter;
            });
        }
    };

    useEffect(() => {
        const filteredList = myTodoList.filter((todo) => {
            const isEndDate = todo.allDay ? dayjs(todo.end).add(-1, 'day').format('YYYY-MM-DD') : todo.end.split('T')[0];
            const isOngoing = dayjs(isEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');

            if (filter.includes('all')) {
                return true;
            }

            if (filter.includes('end') && isOngoing < 0) {
                return true;
            }

            if (filter.includes('ongoing') && isOngoing >= 0) {
                return true;
            }

            return false;
        });

        setTodolist(filteredList);
    }, [filter, myTodoList]);

    return (
        <>
            <div className="w-full h-10 flex items-center pb-2 relative">
                <span className="absolute left-1/2 transform -translate-x-1/2 text-lg">일정 목록</span>
                <div className="ml-auto">
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        style={{
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            padding: "2px",
                            minWidth: "48px"
                        }}
                    >
                        필터
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        sx={{
                            "& ul": { padding: "2px" }
                        }}
                    >
                        {
                            FILTER_LIST.map((f) => {
                                return (
                                    <li className="p-1" key={f.value}>
                                        <FormControlLabel
                                            style={{ margin: 0 }}
                                            sx={{
                                                "& span": { fontSize: "14px" }
                                            }}
                                            control={
                                                <Checkbox
                                                    style={{ padding: 0 }}
                                                    checked={filter.includes(f.value)}
                                                    value={f.value}
                                                    onChange={(e) => handleCheck(e.target.value, e.target.checked)}
                                                />
                                            }
                                            label={f.name}
                                        />
                                    </li>
                                );
                            })
                        }
                    </Menu>
                </div>
            </div>
            <div style={{ width: "100%", height: "calc(92% - 2.5rem)", overflowY: "auto" }}>
                {
                    (todoList.length > 0) ?
                        todoList.map((i) => {
                            const importantEndDate: string = i.allDay ? dayjs(i.end).add(-1, 'day').format('YYYY-MM-DD') : i.end.split('T')[0];
                            const importantEndDday: number = dayjs(importantEndDate).startOf('day').diff(dayjs().startOf('day'), 'day');

                            return (
                                <div key={i.id} className="p-2 border border-gray-300 rounded-xl shadow mb-3 flex cursor-pointer hover:bg-gray-100" onClick={() => searchResultClickEvt(i.id)}>
                                    <div className="w-4 rounded-md mr-2" style={{ backgroundColor: `${i.color}` }}></div>
                                    <div style={{ width: "calc(100% - 1.5rem)" }}>
                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">{i.title}</div>
                                        <div className="flex justify-between">
                                            <div>{`시작일 ${i.start.split('T')[0]}`}</div>
                                            {
                                                i.important &&
                                                <div>
                                                    <i className="bi bi-pin-fill" style={{ color: `${i.color}` }}></i>
                                                    <span>중요 일정</span>
                                                </div>
                                            }
                                        </div>
                                        <div className="flex justify-between">
                                            <div>{`종료일 ${importantEndDate}`}</div>
                                            <div>
                                                {
                                                    (importantEndDday > 0) ?
                                                        (
                                                            (importantEndDday <= 3) ?
                                                                <>
                                                                    <i className="bi bi-alarm text-red-500">
                                                                        {` D-day ${importantEndDday}일`}
                                                                    </i>
                                                                </>
                                                                :
                                                                ` D-day ${importantEndDday}일`
                                                        )
                                                        :
                                                        (
                                                            (importantEndDday === 0) ?
                                                                <>
                                                                    <i className="bi bi-alarm text-red-500">
                                                                        {'D-day 오늘'}
                                                                    </i>
                                                                </>
                                                                :
                                                                '종료된 일정'
                                                        )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        :
                        <div className="w-full h-full flex items-center justify-center text-base">
                            등록된 일정이 없습니다.
                        </div>
                }
            </div>
        </>
    );
};

export default AllTodoList;