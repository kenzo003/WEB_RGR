class MusicPlayerController {
    view;
    model;

    setView(view) {
        this.view = view;
    }

    constructor(model) {
        this.model = model;
    }

    playTrack(track) {


    }

    play(){
        this.view.audio.audio.play();
    }
    addTrackPlaylist(name, href, bob) {
        var playlist = this.model.playlist;
        var id = playlist.tracks.length + 1;
        var song = new Track(id, name, href, bob);
        playlist.addTrack(song);
        this.view.drawTracksOfPlaylist();
    }

    playTrackPlaylist(){
        this.view.audio.audio.src = "";
    }
}