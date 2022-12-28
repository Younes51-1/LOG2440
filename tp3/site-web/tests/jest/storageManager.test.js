import songs from "../../src/assets/js/songs";
import playlists from "../../src/assets/js/playlists";
import StorageManager from "../../src/assets/js/storageManager.js";

describe("StorageManager tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let storageManager;

  const setUpHTML = () => {};

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    setUpHTML();
    storageManager = new StorageManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
    localStorage.clear();
  });

  it("Storage manager should be created", () => {
    expect(storageManager).not.toEqual(null);
  });

  it("loadAllData should correctly call loadDataFromFile for both files", () => {
    const storageManagerLoadDataFromFileSpy = jest
      .spyOn(storageManager, "loadDataFromFile")
      .mockImplementation(() => {});
    storageManager.loadAllData();
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledTimes(2);
    const expectedStorageKeySong = "songs";
    const expectedStorageKeyPlaylists = "playlist";
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(
      expectedStorageKeySong,
      songs
    );
    expect(storageManagerLoadDataFromFileSpy).toHaveBeenCalledWith(
      expectedStorageKeyPlaylists,
      playlists
    );
  });

  it("loadDataFromFile should not reload data if data is already contained in localStorage", () => {
    const defaultKey = "key";
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    const localStorageGetItemSpy = jest.spyOn(
      localStorage.__proto__,
      "getItem"
    );
    const localStorageSetItemSpy = jest.spyOn(
      localStorage.__proto__,
      "setItem"
    );
    storageManager.loadDataFromFile(defaultKey);
    expect(JSON.parse(localStorage.getItem(defaultKey))).toEqual(defaultKey);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(defaultKey);
    expect(localStorageSetItemSpy).not.toBeCalled();
  });

  it("loadDataFromFile should load data if data is not already contained in localStorage", () => {
    const defaultKey = "key";
    jest
      .spyOn(localStorage.__proto__, "getItem")
      .mockImplementation(() => false);
    const localStorageSetItemSpy = jest.spyOn(
      localStorage.__proto__,
      "setItem"
    );
    storageManager.loadDataFromFile(defaultKey);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(defaultKey, "{}");
  });

  it("getData should not get localStorage's data given an invalid storageKey", () => {
    expect(storageManager.getData(undefined)).toBeFalsy();
  });

  it("getData should get localStorage's data given a valid storageKey", () => {
    const defaultKey = "key";
    const localStorageGetItemSpy = jest.spyOn(
      localStorage.__proto__,
      "getItem"
    );
    localStorage.setItem(defaultKey, JSON.stringify(defaultKey));
    storageManager.getData(defaultKey);
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getItemById should call getData", () => {
    const defaultKey = "key";
    const storageManagerGetDataSpy = jest
      .spyOn(storageManager, "getData")
      .mockImplementation(() => []);
    storageManager.getItemById(defaultKey, undefined);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getItemById should find item with specific id", () => {
    const defaultId = 0;
    const defaultKey = "key";
    const item = [{ name: "name", id: defaultId }];
    localStorage.setItem(defaultKey, JSON.stringify(item));
    expect(storageManager.getItemById(defaultKey, defaultId)).toEqual({
      name: "name",
      id: defaultId,
    });
  });

  it("addItem should correctly add an item to localStorage", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest
      .spyOn(localStorage.__proto__, "getItem")
      .mockImplementation(() => JSON.stringify([{ newItem }]));
    const localStorageSetItemSpy = jest
      .spyOn(localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
    storageManager.addItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageGetItemSpy).toHaveBeenCalledWith(storageKey);
    expect(localStorageSetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      storageKey,
      JSON.stringify([{ newItem }, storageKey])
    );
  });

  it("replaceItem should correctly replace an item in localStorage with id checks", () => {
    const defaultKey = "key";
    const oldItem = [{ id: 0, name: "oldItem" }];
    const newItem = { id: 0, name: "newItem" };
    localStorage.setItem(defaultKey, JSON.stringify(oldItem));
    const localStorageSetItemSpy = jest
      .spyOn(localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
    storageManager.replaceItem(defaultKey, newItem);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      defaultKey,
      JSON.stringify([newItem])
    );
  });

  it("replaceItem shouldn't replace an item in localStorage with different id", () => {
    const defaultKey = "key";
    const oldItem = [{ id: 0, name: "oldItem" }];
    const newItem = { id: 3, name: "newItem" };
    localStorage.setItem(defaultKey, JSON.stringify(oldItem));
    const localStorageSetItemSpy = jest
      .spyOn(localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
    storageManager.replaceItem(defaultKey, newItem);
    expect(localStorageSetItemSpy).toHaveBeenCalledWith(
      defaultKey,
      JSON.stringify(oldItem)
    );
  });

  it("replaceItem should call getItem & setItem", () => {
    const storageKey = null;
    const newItem = undefined;
    const localStorageGetItemSpy = jest
      .spyOn(localStorage.__proto__, "getItem")
      .mockImplementation(() => JSON.stringify([]));
    const localStorageSetItemSpy = jest
      .spyOn(localStorage.__proto__, "setItem")
      .mockImplementation(() => {});
    storageManager.replaceItem(storageKey, newItem);
    expect(localStorageGetItemSpy).toBeCalled();
    expect(localStorageSetItemSpy).toBeCalled();
  });

  it("getIdFromName should call getData", () => {
    const defaultKey = "key";
    const defaultName = "name";
    const storageManagerGetDataSpy = jest
      .spyOn(storageManager, "getData")
      .mockImplementation(() => []);
    storageManager.getIdFromName(defaultKey, defaultName);
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(defaultKey);
  });

  it("getIdFromName should return a valid id given a valid elementName", () => {
    const elementName = "elementName";
    const expectedId = 0;
    jest
      .spyOn(storageManager, "getData")
      .mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", elementName)).toEqual(
      expectedId
    );
  });

  it("getIdFromName should return -1 given an invalid elementName", () => {
    const elementName = NaN;
    const expectedId = -1;
    jest
      .spyOn(storageManager, "getData")
      .mockImplementation(() => [{ name: elementName, id: expectedId }]);
    expect(storageManager.getIdFromName("key", elementName)).toEqual(
      expectedId
    );
  });

  it("resetAllData should reset localStorage", () => {
    const storageKey = "key";
    const data = { id: undefined };
    localStorage.setItem(storageKey, JSON.stringify(data));
    storageManager.resetAllData();
    const result = JSON.parse(localStorage.getItem(storageKey));
    expect(result).toEqual(null);
  });
});
