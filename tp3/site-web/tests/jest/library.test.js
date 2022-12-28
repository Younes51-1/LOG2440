import { Library } from "../../src/assets/js/library";
import StorageManager from "../../src/assets/js/storageManager.js";

describe("Library tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let library;

  const setUpHTML = () => {
    // Playlist build
    const playlistSection = document.createElement("section");
    playlistSection.setAttribute("id", "playlist-container");
    document.body.appendChild(playlistSection);

    // Song build
    const songSection = document.createElement("section");
    songSection.setAttribute("id", "song-container");
    document.body.appendChild(songSection);

    // Search Bar build
    const searchBar = document.createElement("input");
    searchBar.setAttribute("id", "search-input");
    document.body.appendChild(searchBar);

    const searchButton = document.createElement("button");
    searchButton.setAttribute("id", "search-btn");
    document.body.appendChild(searchButton);

    const specificSearchInput = document.createElement("input");
    specificSearchInput.setAttribute("id", "exact-search");
    document.body.appendChild(specificSearchInput);

    const clearSearch = document.createElement("i");
    clearSearch.setAttribute("id", "clear-search-bar");
    document.body.appendChild(clearSearch);
  };

  beforeEach(() => {
    delete window.location;
    window.location = { assign: assignMock };
    setUpHTML();
    library = new Library();
    library.storageManager = new StorageManager();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
  });

  it("Library should be instanciated correctly", () => {
    expect(library.storageManager).toEqual(new StorageManager());
  });

  it("generateLists should call buildPlaylistItem and buildSongItem, and append children to containers", () => {
    const buildPlaylistItemSpy = jest
      .spyOn(library, "buildPlaylistItem")
      .mockImplementation(() => {
        return document.createElement("a");
      });
    const buildSongItemSpy = jest
      .spyOn(library, "buildSongItem")
      .mockImplementation(() => {
        return document.createElement("div");
      });

    const playlist = [
      {
        id: "0",
        name: "Ma Premiere Playlist",
        description: "Playlist de base",
        thumbnail: "./assets/img/default.png",
        songs: [{ id: 0 }, { id: 1 }],
      },
    ];
    const song = [
      {
        id: 0,
        name: "Whip",
        artist: "prazkhanal",
        src: "./assets/media/01_song.mp3",
        genre: "Electronic",
        liked: false,
      },
    ];
    library.generateLists(playlist, song);

    expect(buildPlaylistItemSpy).toHaveBeenCalled();
    expect(buildSongItemSpy).toHaveBeenCalled();

    const playlistContainer = document.getElementById("playlist-container");
    expect(playlistContainer.childElementCount).toEqual(1);

    const songListContainer = document.getElementById("song-container");
    expect(songListContainer.childElementCount).toEqual(1);
  });

  it("buildPlaylistItem should build playlist's item", () => {
    const playlist = {
      name: "Ma Premiere Playlist",
      description: "Playlist de base",
      thumbnail: "./assets/img/default.png",
    };
    const playlistItem = library.buildPlaylistItem(playlist);
    expect(playlistItem.hasChildNodes()).toEqual(true);
    expect(playlistItem.innerHTML).toEqual(
      `<div class="playlist-preview"><img src=\"${playlist.thumbnail}\"><i class="fa fa-2x fa-play-circle hidden playlist-play-icon"></i></div><p>${playlist.name}</p><p>${playlist.description}</p>`
    );
  });

  it("buildSongItem should build song's item", () => {
    const songs = [
      {
        id: 0,
        name: "Whip",
        artist: "prazkhanal",
        src: "./assets/media/01_song.mp3",
        genre: "Electronic",
        liked: false,
      },
      {
        name: "Intrigue Fun",
        artist: "Music Town",
        src: "./assets/media/03_song.mp3",
        genre: "Jazz",
        liked: true,
      },
    ];
    for (let i = 0; i < songs.length; i++) {
      const songItem = library.buildSongItem(songs[i]);
      expect(songItem.hasChildNodes()).toEqual(true);

      if (songs[i].liked) {
        expect(songItem.innerHTML).toEqual(
          `<p>${songs[i].name}</p><p>${songs[i].genre}</p><p>${songs[i].artist}</p><button class="fa-heart fa-2x fa"></button>`
        );
      } else {
        expect(songItem.innerHTML).toEqual(
          `<p>${songs[i].name}</p><p>${songs[i].genre}</p><p>${songs[i].artist}</p><button class="fa-heart fa-2x fa-regular"></button>`
        );
      }
    }
  });

  it("buildSongItem should add a call to StorageManager.replaceItem on click event and change the classList", () => {
    const songs = [
      {
        id: 0,
        name: "Whip",
        artist: "prazkhanal",
        src: "./assets/media/01_song.mp3",
        genre: "Electronic",
        liked: false,
      },
      {
        name: "Intrigue Fun",
        artist: "Music Town",
        src: "./assets/media/03_song.mp3",
        genre: "Jazz",
        liked: true,
      },
    ];
    const songsItem = [];
    songsItem.push(library.buildSongItem(songs[0]));
    songsItem.push(library.buildSongItem(songs[1]));
    const replaceItemSpy = jest
      .spyOn(library.storageManager, "replaceItem")
      .mockImplementation(() => {});

    for (let i = 0; i < songs.length; i++) {
      const button = songsItem[i].getElementsByTagName("button")[0];
      if (button.classList.contains("fa")) {
        button.click();
        expect(button.classList.contains("fa-regular")).toBeTruthy();
        expect(button.classList.contains("fa")).toBeFalsy();
      } else {
        button.click();
        expect(button.classList.contains("fa")).toBeTruthy();
        expect(button.classList.contains("fa-regular")).toBeFalsy();
      }
    }
    expect(replaceItemSpy.mock.calls.length).toBe(2);
  });

  it("load should load window", () => {
    const storageManagerLoadAllDataSpy = jest
      .spyOn(library.storageManager, "loadAllData")
      .mockImplementation(() => {});
    const storageManagerGetDataSpy = jest
      .spyOn(library.storageManager, "getData")
      .mockImplementation(() => {});
    const libraryGenerateListsSpy = jest
      .spyOn(library, "generateLists")
      .mockImplementation(() => {});
    library.load();
    expect(storageManagerLoadAllDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledTimes(2);
    expect(libraryGenerateListsSpy).toBeCalled();
  });

  describe("Search bar tests", () => {
    it("clicking on the search button should prevent form submission and call search", () => {
      const event = new Event("click");
      const eventSpy = jest.spyOn(event, "preventDefault");
      const searchSpy = jest
        .spyOn(library, "search")
        .mockImplementation(() => {});
      library.load();
      document.getElementById("search-btn").dispatchEvent(event);

      expect(eventSpy).toHaveBeenCalled();
      expect(searchSpy).toHaveBeenCalled();
    });

    it("clicking on the search button should call search with correct parameters", () => {
      const searchSpy = jest
        .spyOn(library, "search")
        .mockImplementation(() => {});
      jest
        .spyOn(library.storageManager, "getData")
        .mockImplementation(() => []);
      document.getElementById("exact-search").checked = true;
      library.load();
      document.getElementById("search-btn").click();
      expect(searchSpy).toHaveBeenCalledWith(
        document.getElementById("search-input"),
        { playlists: [], songs: [] },
        true
      );
    });

    it("includesSubstring should return true if substring is in original string without exactMatch", () => {
      const originalString = "Test";
      const subString = "es";
      expect(
        library.includesSubstring(originalString, subString, false)
      ).toBeTruthy();
    });

    it("includesSubstring should return false if substring is not in original string without exactMatch", () => {
      const originalString = "Test";
      const subString = "abc";
      expect(
        library.includesSubstring(originalString, subString, false)
      ).toBeFalsy();
    });

    it("includesSubstring should return true if substring is in original string with exactMatch", () => {
      const originalString = "Test";
      const subString = "Te";
      expect(
        library.includesSubstring(originalString, subString, true)
      ).toBeTruthy();
    });

    it("includesSubstring should return false if substring is not in original string with exactMatch", () => {
      const originalString = "Test";
      const subString = "te";
      expect(
        library.includesSubstring(originalString, subString, true)
      ).toBeFalsy();
    });

    it("searchInFields should return true if atleast one field contains the string", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const subString = "co";
      expect(library.searchInFields(fields, subString, false)).toBeTruthy();
    });

    it("searchInFields should return false if none of the fields contains the string", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const subString = "def";
      expect(library.searchInFields(fields, subString, false)).toBeFalsy();
    });

    it("searchInFields should call includesSubstring", () => {
      const fields = ["Bounce", "Coma-Media", "Electronic"];
      const spy = jest
        .spyOn(library, "includesSubstring")
        .mockImplementation(() => true);
      library.searchInFields(fields, "allo", false);
      expect(spy).toHaveBeenCalled();
    });

    it("search should call searchInFields for playlists and songs and generateLists", () => {
      const searchSpy = jest
        .spyOn(library, "searchInFields")
        .mockImplementation(() => true);
      const generateListsSpy = jest
        .spyOn(library, "generateLists")
        .mockImplementation(() => {});

      const searchSources = {
        playlists: [
          { name: "p1", description: "d1" },
          { name: "p2", description: "d2" },
        ],
        songs: [{ name: "Bounce", artist: "Coma-Media", genre: "Electronic" }],
      };
      const expectedSearchCalls =
        searchSources.playlists.length + searchSources.songs.length;
      const searchInput = document.getElementById("search-input");
      searchInput.value = "co";

      library.search(searchInput, searchSources, false);

      expect(searchSpy).toHaveBeenCalledTimes(expectedSearchCalls);
      expect(generateListsSpy).toHaveBeenCalled();
    });

    it("search should call generateLists with correct filtered lists", () => {
      // All playlists will match the search function
      const searchSpy = jest
        .spyOn(library, "searchInFields")
        .mockImplementation(() => true);
      const generateListsSpy = jest
        .spyOn(library, "generateLists")
        .mockImplementation(() => {});

      const searchSources = {
        playlists: [
          { name: "p1", description: "d1" },
          { name: "p2", description: "d2" },
        ],
        songs: [{ name: "Bounce", artist: "Coma-Media", genre: "Electronic" }],
      };
      const expectedSearchCalls =
        searchSources.playlists.length + searchSources.songs.length;
      const searchInput = document.getElementById("search-input");
      searchInput.value = "co";

      library.search(searchInput, searchSources, false);

      expect(searchSpy).toHaveBeenCalledTimes(expectedSearchCalls);
      expect(generateListsSpy).toHaveBeenCalledWith(
        searchSources.playlists,
        searchSources.songs
      );
    });

    it("search should generate empty Playlists and Songs if nothing match", () => {
      // All playlists will not match the search function
      const searchSpy = jest
        .spyOn(library, "searchInFields")
        .mockImplementation(() => false);
      const generateListsSpy = jest
        .spyOn(library, "generateLists")
        .mockImplementation(() => {});

      const searchSources = {
        playlists: [
          { name: "p1", description: "d1" },
          { name: "p2", description: "d2" },
        ],
        songs: [{ name: "Bounce", artist: "Coma-Media", genre: "Electronic" }],
      };
      const expectedSearchCalls =
        searchSources.playlists.length + searchSources.songs.length;
      const searchInput = document.getElementById("search-input");
      searchInput.value = "co";

      library.search(searchInput, searchSources, false);

      expect(searchSpy).toHaveBeenCalledTimes(expectedSearchCalls);
      expect(generateListsSpy).toHaveBeenCalledWith([], []);
    });
  });
});
