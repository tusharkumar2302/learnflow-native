import { create } from "zustand";

type para = {
  vidId: string;
  setVidId: (id: string) => void;
  reset: () => void;
};

const currentVid = create<para>((set) => ({
  vidId: "",
  setVidId: (id) => set({ vidId: id }),
  reset: () => set({ vidId: "" }),
}));

export default currentVid;
