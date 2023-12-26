import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';

import { BookListItem, SearchFormProps, StoryAction, StoryReducerActionObj, StoryReducerObj } from './interfaces/types.ts';

import App, {
    storiesReducer,
    Item,
    SearchForm,
} from './App.tsx';

vi.mock('axios');

const mockedAxios = vi.mocked(axios, true);

const storyOne: BookListItem = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
};

const storyTwo: BookListItem = {
    title: 'Redux',
    url: 'https://reduxjs.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1
};

const stories: BookListItem[] = [storyOne, storyTwo];

describe('something truthy and falsy', () => {
    it('true to be true', () => {
        expect(true).toBeTruthy();
    });

    it('false to be false', () => {
        expect(false).toBeFalsy();
    });
});

describe('storiesReducer', () => {
    it('sets isLoading to TRUE and isError to FALSE on FETCH INIT', () => {
        const storyObj2: StoryReducerObj = {
            isError: false,
            isLoading: false,
            data: []
        };

        const storyActionObj2: StoryReducerActionObj = {
            type: StoryAction.STORIES_FETCH_INIT
        };

        const newState: StoryReducerObj = storiesReducer(storyObj2, storyActionObj2);
        
        const expectedState: StoryReducerObj = {
            isLoading: true,
            isError: false,
            data: []
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('sets data to payload, isLoading to FALSE, isError to FALSE on FETCH SUCCESS', () => {
        const storyObj3: StoryReducerObj = {
            data: [],
            isError: true,
            isLoading: true
        };

        const storyActionObj3: StoryReducerActionObj = {
            type: StoryAction.STORIES_FETCH_SUCCESS,
            payload: stories
        };

        const newState: StoryReducerObj = storiesReducer(storyObj3, storyActionObj3);

        const expectedState: StoryReducerObj = {
            data: stories,
            isError: false,
            isLoading: false
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('sets isLoading to FALSE and isError to TRUE on FAILURE', () => {
        const storyObj4: StoryReducerObj = {
            data: [],
            isError: false,
            isLoading: true
        };

        const storyActionObj4: StoryReducerActionObj = {type: StoryAction.STORIES_FETCH_FAILURE};

        const newState: StoryReducerObj = storiesReducer(storyObj4, storyActionObj4);

        const expectedState: StoryReducerObj = {
            ...storyObj4,
            isLoading: false,
            isError: true
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('removes a story from all stories on REMOVE STORY', () => {

        const storyObj1: StoryReducerObj = {
            isError: false,
            isLoading: false,
            data: stories
        };

        const storyActionObj1: StoryReducerActionObj = {
            type: StoryAction.REMOVE_STORY,
            payload: [storyOne]
        };

        const newState: StoryReducerObj = storiesReducer(storyObj1, storyActionObj1);

        const expectedState: StoryReducerObj = {
            ...storyObj1,
            data: [storyTwo]
        };

        expect(newState).toStrictEqual(expectedState);

    });
});

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne} onRemoveItem={(x) => x}/>);

        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable dismiss button', () => {
        render(<Item item={storyOne} onRemoveItem={(x) => x}/>);

        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn();

        render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);

        fireEvent.click(screen.getByRole('button'));

        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
});

describe('SearchForm', () => {
    const SearchFormProps: SearchFormProps = {
        searchTerm: 'React',
        onSearchInput: vi.fn(),
        onSearchSubmit: vi.fn()
    };

    it('renders the input field with its value', () => {
        render(<SearchForm {...SearchFormProps} />);

        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });

    it('renders the correct label', () => {
        render(<SearchForm {...SearchFormProps} />);

        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it('calls onSearchInput on input field change', () => {
        render(<SearchForm {...SearchFormProps} />);

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: { value: 'Redux'}
        });

        expect(SearchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    it('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...SearchFormProps} />);

        fireEvent.submit(screen.getByRole('button'));

        expect(SearchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        });

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App />);

        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        await waitFor(async () => await promise);

        expect(screen.queryByText(/Loading/)).toBeNull();

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();

        expect(screen.getAllByTestId('check-svg').length).toBe(2);
    });

    it('fails fetching data', async () => {
        const promise = Promise.reject();

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App />);

        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }
    });

    it('removes a story', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        });

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App />);

        await waitFor(async () => await promise);

        expect(screen.getAllByTestId('check-svg').length).toBe(2);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

        fireEvent.click(screen.getAllByTestId('check-svg')[0]);

        expect(screen.getAllByTestId('check-svg').length).toBe(1);
        expect(screen.queryByText('Jordan Walke')).toBeNull();
    });

    it('searches for specific stories', async () => {
        const reactPromise = Promise.resolve({
            data: {
                hits: stories
            }
        });

        const anotherStory: BookListItem = {
            title: 'Javascript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3
        };

        const javascriptPromise = Promise.resolve({
            data: {
                hits: [anotherStory]
            }
        });

        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('React')) {
                return reactPromise;
            }

            if (url.includes('JavaScript')) {
                return javascriptPromise;
            }

            throw Error();
        });

        render(<App />);

        await waitFor(async () => await reactPromise);

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('JavaScript')).toBeNull();

        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();

        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
        expect(screen.queryByText('Brendan Eich')).toBeNull();

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: {
                value: 'JavaScript'
            }
        });

        expect(screen.queryByDisplayValue('React')).toBeNull();
        expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.submit(screen.getByText('Submit'));

        await waitFor(async () => await javascriptPromise);

        expect(screen.queryByText('Jordan Walke')).toBeNull();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
        expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
    });
});