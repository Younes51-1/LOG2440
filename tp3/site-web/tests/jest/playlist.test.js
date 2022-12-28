import { jest } from "@jest/globals";
import { SHORTCUTS, SKIP_TIME } from "../../src/assets/js/consts";
import Player from "../../src/assets/js/player";
import PlayListManager from "../../src/assets/js/playlist";
import StorageManager from "../../src/assets/js/storageManager";

/* eslint-disable max-lines */
/**********************************************************************************/
/*                                                                                */
/* Nous avons ajoute comme dans les autres fichiers des tests qui nous permettent */
/* de tester des cas qui ne sont pas couverts par les tests deja presents.        */
/* Par exemple : le cas si l'utilisateur clique sur une touche qui ne se trouve   */
/* pas dans les SHORTCUTS, aucune fonction ne doit etre appelee, .......          */
/*                                                                                */
/**********************************************************************************/

describe("Playlist tests", () => {
  const assignMock = jest.fn();
  const clearHTML = () => (document.body.innerHTML = "");
  let playListManager;

  const setUpHTML = () => {
    const playListImg = document.createElement("img");
    playListImg.setAttribute("id", "playlist-img");
    playListImg.setAttribute("src", "");
    document.body.appendChild(playListImg);

    const playListTitle = document.createElement("h2");
    playListTitle.setAttribute("id", "playlist-title");
    playListTitle.setAttribute("textContent", "");
    document.body.appendChild(playListTitle);

    const songContainer = document.createElement("div");
    songContainer.setAttribute("id", "song-container");
    document.body.appendChild(songContainer);

    const songItem = document.createElement("div");
    songItem.setAttribute("id", "song-item");
    document.body.appendChild(songItem);

    const nowPlaying = document.createElement("div");
    nowPlaying.setAttribute("id", "now-playing");
    nowPlaying.setAttribute("textContent", "");
    document.body.appendChild(nowPlaying);

    const playButton = document.createElement("button");
    playButton.setAttribute("id", "play");
    playButton.setAttribute("classList", "");
    document.body.appendChild(playButton);

    const previousButton = document.createElement("button");
    previousButton.setAttribute("id", "previous");
    previousButton.setAttribute("classList", "");
    document.body.appendChild(previousButton);

    const nextButton = document.createElement("button");
    nextButton.setAttribute("id", "next");
    nextButton.setAttribute("classList", "");
    document.body.appendChild(nextButton);

    const muteButton = document.createElement("button");
    muteButton.setAttribute("id", "mute");
    muteButton.setAttribute("classList", "");
    document.body.appendChild(muteButton);

    const shuffleButton = document.createElement("button");
    shuffleButton.setAttribute("id", "shuffle");
    shuffleButton.setAttribute("classList", "");
    document.body.appendChild(shuffleButton);

    const currentTimeline = document.createElement("span");
    currentTimeline.setAttribute("id", "timeline-current");
    document.body.appendChild(currentTimeline);

    const timeline = document.createElement("input");
    timeline.setAttribute("id", "timeline");
    timeline.setAttribute("type", "range");
    timeline.setAttribute("max", "100");
    timeline.setAttribute("value", "0");
    document.body.appendChild(timeline);

    const endTimeline = document.createElement("span");
    endTimeline.setAttribute("id", "timeline-end");
    document.body.appendChild(endTimeline);

    const audio = document.createElement("audio");
    audio.setAttribute("id", "audio");
    document.body.appendChild(audio);
  };

  beforeEach(() => {
    delete window.location;
    setUpHTML();
    playListManager = new PlayListManager(new Player(), new StorageManager());
  });

  afterEach(() => {
    jest.restoreAllMocks();
    assignMock.mockClear();
    clearHTML();
  });

  it("loadSongs should buildSongItem, and call StorageManager {getItemById, getData} & Player.loadSongs for a valid playlist", () => {
    const songs = [{ id: 0 }, { id: 1 }];
    const playList = { songs, thumbnail: "", name: "" };
    const buildSongItemSpy = jest
      .spyOn(playListManager, "buildSongItem")
      .mockImplementation(() => document.getElementById("song-item"));
    const storageManagerGetItemByIdSpy = jest
      .spyOn(playListManager.storageManager, "getItemById")
      .mockImplementation(() => playList);
    const storageManagerGetDataSpy = jest
      .spyOn(playListManager.storageManager, "getData")
      .mockImplementation(() => songs);
    const playerLoadSongsSpy = jest
      .spyOn(playListManager.player, "loadSongs")
      .mockImplementation(() => {});
    const playlistId = null;
    playListManager.loadSongs(playlistId);
    expect(storageManagerGetItemByIdSpy).toBeCalled();
    expect(storageManagerGetItemByIdSpy).toHaveBeenCalledWith(
      playListManager.storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    expect(storageManagerGetDataSpy).toBeCalled();
    expect(storageManagerGetDataSpy).toHaveBeenCalledWith(
      playListManager.storageManager.STORAGE_KEY_SONGS
    );
    expect(playerLoadSongsSpy).toBeCalled();
    expect(playerLoadSongsSpy).toHaveBeenCalledWith(songs);
    expect(buildSongItemSpy).toBeCalled();
    const expectedSongsIndex = 0;
    expect(buildSongItemSpy).toHaveBeenCalledWith(
      songs[expectedSongsIndex],
      expectedSongsIndex
    );
  });

  it("loadSongs should build nothing for invalid ID", () => {
    const buildSongItemSpy = jest
      .spyOn(playListManager, "buildSongItem")
      .mockImplementation(() => document.getElementById("song-item"));
    const storageManagerGetItemByIdSpy = jest
      .spyOn(playListManager.storageManager, "getItemById")
      .mockImplementation(() => undefined);
    const storageManagerGetDataSpy = jest
      .spyOn(playListManager.storageManager, "getData")
      .mockImplementation(() => {});
    const playerLoadSongsSpy = jest
      .spyOn(playListManager.player, "loadSongs")
      .mockImplementation(() => {});
    const playlistId = null;
    playListManager.loadSongs(playlistId);
    expect(storageManagerGetItemByIdSpy).toBeCalled();
    expect(storageManagerGetItemByIdSpy).toHaveBeenCalledWith(
      playListManager.storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    expect(storageManagerGetDataSpy).not.toBeCalled();
    expect(playerLoadSongsSpy).not.toBeCalled();
    expect(buildSongItemSpy).not.toBeCalled();
  });

  it("buildSongItem should build song's item while calling playAudio & setCurrentSongName upon click", () => {
    const song = {
      id: 0,
      name: "Whip",
      artist: "prazkhanal",
      src: "./assets/media/01_song.mp3",
      genre: "Electronic",
      liked: false,
    };
    const songContainer = document.getElementById("song-container");
    const setCurrentSongNameSpy = jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    const playAudioSpy = jest
      .spyOn(playListManager.player, "playAudio")
      .mockImplementation(() => {});

    expect(songContainer.hasChildNodes()).toBeFalsy();
    songContainer.appendChild(playListManager.buildSongItem(song, 0));
    expect(songContainer.hasChildNodes()).toBeTruthy();

    songContainer.firstChild.dispatchEvent(new Event("click"));
    expect(setCurrentSongNameSpy).toBeCalled();
    expect(playAudioSpy).toHaveBeenCalledWith(0);
  });

  it("buildSongItem should build different heart icons", () => {
    const firstSong = { name: "", genre: "", artist: "", liked: true };
    const secondSong = { name: "", genre: "", artist: "", liked: false };
    const index = 0;
    const songContainer = document.getElementById("song-container");
    jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    jest
      .spyOn(playListManager.player, "playAudio")
      .mockImplementation(() => {});
    songContainer.appendChild(playListManager.buildSongItem(firstSong, index));
    songContainer.appendChild(
      playListManager.buildSongItem(secondSong, index + 1)
    );

    expect(
      songContainer.firstChild
        .getElementsByTagName("i")[0]
        .classList.contains("fa")
    ).toBeTruthy();
    expect(
      songContainer.firstChild
        .getElementsByTagName("i")[0]
        .classList.contains("fa-regular")
    ).toBeFalsy();

    expect(
      songContainer.lastChild
        .getElementsByTagName("i")[0]
        .classList.contains("fa-regular")
    ).toBeTruthy();
    expect(
      songContainer.lastChild
        .getElementsByTagName("i")[0]
        .classList.contains("fa")
    ).toBeFalsy();
  });

  it("playAudio should call setCurrentSongName & Player.playAudio", () => {
    const setCurrentSongNameSpy = jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    const playAudioSpy = jest
      .spyOn(playListManager.player, "playAudio")
      .mockImplementation(() => {});
    playListManager.playAudio(0);

    expect(setCurrentSongNameSpy).toBeCalled();
    expect(playAudioSpy).toHaveBeenCalledWith(0);
  });

  it("playAudio should correctly add class lists if audio is paused", () => {
    jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    jest
      .spyOn(playListManager.player, "playAudio")
      .mockImplementation(() => {});
    document.getElementById("play").classList.add("fa-pause");
    jest
      .spyOn(playListManager.player.audio, "paused", "get")
      .mockReturnValue(true);
    playListManager.playAudio(null);
    expect(document.getElementById("play").classList.length).toEqual(1);
    expect(document.getElementById("play").classList[0]).toEqual("fa-play");
  });

  it("playAudio should correctly add class lists if audio is not paused", () => {
    jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    jest
      .spyOn(playListManager.player, "playAudio")
      .mockImplementation(() => {});
    document.getElementById("play").classList.add("fa-pause");
    jest
      .spyOn(playListManager.player.audio, "paused", "get")
      .mockReturnValue(false);
    playListManager.playAudio(null);
    expect(document.getElementById("play").classList.length).toEqual(1);
    expect(document.getElementById("play").classList[0]).toEqual("fa-pause");
  });

  it("playPreviousSong should call setCurrentSongName & Player.playPreviousSong", () => {
    const setCurrentSongNameSpy = jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    const playSpy = jest
      .spyOn(playListManager.player, "playPreviousSong")
      .mockImplementation(() => {});
    playListManager.playPreviousSong();
    expect(setCurrentSongNameSpy).toBeCalled();
    expect(playSpy).toBeCalled();
  });

  it("playNextSong should call setCurrentSongName & Player.playNextSong", () => {
    const setCurrentSongNameSpy = jest
      .spyOn(playListManager, "setCurrentSongName")
      .mockImplementation(() => {});
    const playSpy = jest
      .spyOn(playListManager.player, "playNextSong")
      .mockImplementation(() => {});
    playListManager.playNextSong();
    expect(setCurrentSongNameSpy).toBeCalled();
    expect(playSpy).toBeCalled();
  });

  it("setCurrentSongName should set song name to #now-playing element", () => {
    const currentSongNameElementId = "now-playing";
    const currentSongNamePlaying = "L'Assasymphonie";
    jest
      .spyOn(playListManager.player, "currentSong", "get")
      .mockReturnValue({ name: currentSongNamePlaying });
    expect(
      document.getElementById(currentSongNameElementId).textContent
    ).toEqual("");
    playListManager.setCurrentSongName();
    const expectedTextContent = `On joue : ${currentSongNamePlaying}`;
    expect(
      document.getElementById(currentSongNameElementId).textContent
    ).toEqual(expectedTextContent);
  });

  it("timelineUpdate should correctly update timeline", () => {
    const currentTime = 50;
    const duration = currentTime * 3;
    jest
      .spyOn(playListManager.player.audio, "currentTime", "get")
      .mockReturnValue(currentTime);
    jest
      .spyOn(playListManager.player.audio, "duration", "get")
      .mockReturnValue(duration);
    playListManager.timelineUpdate(
      document.getElementById("timeline-current"),
      { value: 0 },
      document.getElementById("timeline-end")
    );
    expect(document.getElementById("timeline-current").textContent).toEqual(
      "00:50"
    );
    expect(document.getElementById("timeline-end").textContent).toEqual(
      "02:30"
    );
  });

  it("timelineUpdate should correctly update timeline-end to '' in case of a Nan duration", () => {
    const currentTime = 50;
    const duration = NaN;
    jest
      .spyOn(playListManager.player.audio, "currentTime", "get")
      .mockReturnValue(currentTime);
    jest
      .spyOn(playListManager.player.audio, "duration", "get")
      .mockReturnValue(duration);
    playListManager.timelineUpdate(
      document.getElementById("timeline-current"),
      { value: 0 },
      document.getElementById("timeline-end")
    );
    expect(document.getElementById("timeline-current").textContent).toEqual(
      "00:50"
    );
    expect(document.getElementById("timeline-end").textContent).toEqual("");
  });

  it("audioSeek should call Player.audioSeek", () => {
    const audioSeekSpy = jest
      .spyOn(playListManager.player, "audioSeek")
      .mockImplementation(() => {});
    const timeline = document.getElementById("timeline");
    playListManager.audioSeek(timeline);

    expect(audioSeekSpy).toHaveBeenCalledWith(timeline.value);
  });

  it("muteToggle should call Player.muteToggle", () => {
    const muteToggleSpy = jest
      .spyOn(playListManager.player, "muteToggle")
      .mockImplementation(() => {});
    playListManager.muteToggle();

    expect(muteToggleSpy).toBeCalled();
  });

  it("muteToggle should correctly add class lists if player is muted", () => {
    document.getElementById("mute").classList.add("fa-volume-mute");
    jest
      .spyOn(playListManager.player, "muteToggle")
      .mockImplementation(() => true);
    playListManager.muteToggle();
    expect(document.getElementById("mute").classList.length).toEqual(1);
    expect(document.getElementById("mute").classList[0]).toEqual(
      "fa-volume-high"
    );
  });

  it("muteToggle should correctly add class lists if player is not muted", () => {
    document.getElementById("mute").classList.add("fa-volume-high");
    jest
      .spyOn(playListManager.player, "muteToggle")
      .mockImplementation(() => false);
    playListManager.muteToggle();
    expect(document.getElementById("mute").classList.length).toEqual(1);
    expect(document.getElementById("mute").classList[0]).toEqual(
      "fa-volume-mute"
    );
  });

  it("shuffleToggle should call Player.shuffleToggle", () => {
    const shuffleToggleSpy = jest
      .spyOn(playListManager.player, "shuffleToggle")
      .mockImplementation(() => {});
    playListManager.shuffleToggle(document.getElementById("shuffle"));

    expect(shuffleToggleSpy).toBeCalled();
  });

  it("shuffleToggle should correctly add class lists if shuffled", () => {
    jest
      .spyOn(playListManager.player, "shuffleToggle")
      .mockImplementation(() => true);
    playListManager.shuffleToggle(document.getElementById("shuffle"));
    expect(document.getElementById("shuffle").classList[0]).toEqual(
      "control-btn-toggled"
    );
    expect(document.getElementById("shuffle").classList.length).toEqual(1);
  });

  it("shuffleToggle should correctly add class lists if not shuffled", () => {
    jest
      .spyOn(playListManager.player, "shuffleToggle")
      .mockImplementation(() => false);
    document.getElementById("shuffle").classList.add("control-btn-toggled");
    playListManager.shuffleToggle(document.getElementById("shuffle"));
    expect(document.getElementById("shuffle").classList.length).toEqual(0);
  });

  it("scrubTime should call Player.scrubTime", () => {
    const scrubTimeSpy = jest
      .spyOn(playListManager.player, "scrubTime")
      .mockImplementation(() => {});
    const delta = 15;
    playListManager.scrubTime(delta);

    expect(scrubTimeSpy).toHaveBeenCalledWith(delta);
  });

  it("bindEvents should correctly add event listeners to Player.audio", () => {
    playListManager.player.audio = document.getElementById("audio");
    playListManager.bindEvents();
    const timelineUpdateSpy = jest
      .spyOn(playListManager, "timelineUpdate")
      .mockImplementation(() => {});
    document.getElementById("audio").dispatchEvent(new Event("timeupdate"));
    expect(timelineUpdateSpy).toBeCalled();
    expect(timelineUpdateSpy).toHaveBeenCalledWith(
      document.getElementById("timeline-current"),
      document.getElementById("timeline"),
      document.getElementById("timeline-end")
    );
    const playNextSongSpy = jest
      .spyOn(playListManager, "playNextSong")
      .mockImplementation(() => {});
    document.getElementById("audio").dispatchEvent(new Event("ended"));
    expect(playNextSongSpy).toBeCalled();
  });

  it("bindEvents should correctly add event listener to timeline", () => {
    playListManager.bindEvents();
    const timelineSpy = jest
      .spyOn(playListManager, "audioSeek")
      .mockImplementation(() => {});
    const timeline = document.getElementById("timeline");
    timeline.dispatchEvent(new Event("input"));

    expect(timelineSpy).toHaveBeenCalledWith(timeline);
  });

  it("bindEvents should correctly add event listener to play button", () => {
    playListManager.bindEvents();
    const playAudioSpy = jest
      .spyOn(playListManager, "playAudio")
      .mockImplementation(() => {});
    document.getElementById("play").dispatchEvent(new Event("click"));
    expect(playAudioSpy).toBeCalled();
  });

  it("bindEvents should correctly add event listener to mute button", () => {
    playListManager.bindEvents();
    const muteAudioSpy = jest
      .spyOn(playListManager, "muteToggle")
      .mockImplementation(() => {});
    document.getElementById("mute").dispatchEvent(new Event("click"));
    expect(muteAudioSpy).toBeCalled();
  });

  it("bindEvents should correctly add event listener to previous button", () => {
    playListManager.bindEvents();
    const previousButtonSpy = jest
      .spyOn(playListManager, "playPreviousSong")
      .mockImplementation(() => {});
    document.getElementById("previous").dispatchEvent(new Event("click"));
    expect(previousButtonSpy).toBeCalled();
  });

  it("bindEvents should correctly add event listener to next button", () => {
    playListManager.bindEvents();
    const nextAudioSpy = jest
      .spyOn(playListManager, "playNextSong")
      .mockImplementation(() => {});
    document.getElementById("next").dispatchEvent(new Event("click"));
    expect(nextAudioSpy).toBeCalled();
  });

  it("bindEvents should correctly add event listener to shuffle button", () => {
    playListManager.bindEvents();
    const shuffleToggleSpy = jest
      .spyOn(playListManager, "shuffleToggle")
      .mockImplementation(() => {});
    document.getElementById("shuffle").dispatchEvent(new Event("click"));
    expect(shuffleToggleSpy).toBeCalled();
  });

  it("bindShortcuts should correctly bind shortcuts", () => {
    playListManager.bindShortcuts();
    const expectedLength = 6;
    expect(playListManager.shortcuts.size).toEqual(expectedLength);
    expect(playListManager.shortcuts.get(SHORTCUTS.GO_FORWARD)).not.toEqual(
      undefined
    );
    expect(playListManager.shortcuts.get(SHORTCUTS.GO_BACK)).not.toEqual(
      undefined
    );
    expect(playListManager.shortcuts.get(SHORTCUTS.PLAY_PAUSE)).not.toEqual(
      undefined
    );
    expect(playListManager.shortcuts.get(SHORTCUTS.NEXT_SONG)).not.toEqual(
      undefined
    );
    expect(playListManager.shortcuts.get(SHORTCUTS.PREVIOUS_SONG)).not.toEqual(
      undefined
    );
    expect(playListManager.shortcuts.get(SHORTCUTS.MUTE)).not.toEqual(
      undefined
    );
    const scrubTimeSpy = jest
      .spyOn(playListManager, "scrubTime")
      .mockImplementation(() => {});
    playListManager.shortcuts.get(SHORTCUTS.GO_FORWARD)();
    expect(scrubTimeSpy).toHaveBeenCalledWith(SKIP_TIME);
    playListManager.shortcuts.get(SHORTCUTS.GO_BACK)();
    expect(scrubTimeSpy).toHaveBeenCalledWith(-SKIP_TIME);
    const playAudioSpy = jest
      .spyOn(playListManager, "playAudio")
      .mockImplementation(() => {});
    playListManager.shortcuts.get(SHORTCUTS.PLAY_PAUSE)();
    expect(playAudioSpy).toBeCalled();
    const playNextSongSpy = jest
      .spyOn(playListManager, "playNextSong")
      .mockImplementation(() => {});
    playListManager.shortcuts.get(SHORTCUTS.NEXT_SONG)();
    expect(playNextSongSpy).toBeCalled();
    const playPreviousSongSpy = jest
      .spyOn(playListManager, "playPreviousSong")
      .mockImplementation(() => {});
    playListManager.shortcuts.get(SHORTCUTS.PREVIOUS_SONG)();
    expect(playPreviousSongSpy).toBeCalled();
    const muteToggleSpy = jest
      .spyOn(playListManager, "muteToggle")
      .mockImplementation(() => {});
    playListManager.shortcuts.get(SHORTCUTS.MUTE)();
    expect(muteToggleSpy).toBeCalled();
    expect(scrubTimeSpy).toHaveBeenCalledTimes(2);
    expect(playAudioSpy).toHaveBeenCalledTimes(1);
    expect(playNextSongSpy).toHaveBeenCalledTimes(1);
    expect(playPreviousSongSpy).toHaveBeenCalledTimes(1);
    expect(muteToggleSpy).toHaveBeenCalledTimes(1);
  });

  it("bindShortcuts should correctly add keydown event listener", () => {
    const key = SHORTCUTS.MUTE;
    const muteToggleSpy = jest
      .spyOn(playListManager, "muteToggle")
      .mockImplementation(() => {});
    playListManager.shortcuts.set(key, () => playListManager.muteToggle());
    playListManager.bindShortcuts();
    const keydownEvent = new Event("keydown");
    keydownEvent.key = key;
    document.dispatchEvent(keydownEvent);
    expect(muteToggleSpy).toBeCalled();
  });

  it("bindShortcuts shouldn't call a function in a wrong key event", () => {
    const key = SHORTCUTS.MUTE;
    const muteToggleSpy = jest
      .spyOn(playListManager, "muteToggle")
      .mockImplementation(() => {});
    playListManager.shortcuts.set(key, () => playListManager.muteToggle());
    playListManager.bindShortcuts();
    const keydownEvent = new Event("keydown");
    keydownEvent.key = "c";
    document.dispatchEvent(keydownEvent);
    expect(muteToggleSpy).not.toBeCalled();
  });

  it("load should correctly call bindEvents, bindShortcuts, laodSongs & StorageManger.loadAllData", () => {
    const bindEventsSpy = jest
      .spyOn(playListManager, "bindEvents")
      .mockImplementation(() => {});
    const bindShortcutsSpy = jest
      .spyOn(playListManager, "bindShortcuts")
      .mockImplementation(() => {});
    const loadSongsSpy = jest
      .spyOn(playListManager, "loadSongs")
      .mockImplementation(() => {});
    playListManager.load();
    expect(bindEventsSpy).toBeCalled();
    expect(bindShortcutsSpy).toBeCalled();
    expect(loadSongsSpy).toBeCalled();
  });
});
