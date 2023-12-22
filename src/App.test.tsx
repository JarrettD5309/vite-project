import { describe, it, expect } from 'vitest';

import { BookListItem, StoryAction, StoryReducerActionObj, StoryReducerObj } from './interfaces/types.ts';

import {
    storiesReducer,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from './App.tsx';

const storyOne: BookListItem = {
    title: 'React',
    url: 'https://react.js.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0
};

const storyTwo: BookListItem = {
    title: 'Redux',
    url: 'https://redux.js.org/',
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