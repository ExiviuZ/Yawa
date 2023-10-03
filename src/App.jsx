import { useState } from "react";

const initialFriends = [
  {
    name: "Jonathan",
    imgUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel&name=Jonathan",
    bill: 0,
    userExpense: 0,
    expense: 0,
    paying: null,
  },
  {
    name: "Jayson",
    imgUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel&name=Jayson",
    bill: 0,
    userExpense: 0,
    expense: 0,
    paying: null,
  },
  {
    name: "Homer",
    imgUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel&name=Shew",
    bill: 0,
    userExpense: 0,
    expense: 0,
    paying: null,
  },
];

export default function App() {
  const [selected, setSelected] = useState(null);
  const [friends, setFriends] = useState(initialFriends);

  function onSetSelect(index) {
    setSelected(selected === index ? null : index);
  }

  return (
    <>
      <div className="friend-container">
        <FriendsList
          friends={friends}
          onSetSelect={onSetSelect}
          selected={selected}
        />
        <AddFriend setFriends={setFriends} />
      </div>
      {selected !== null ? (
        <div className="split-bill">
          <SplitBill
            setFriends={setFriends}
            selectedFriend={friends[selected]}
            selected={selected}
            friends={friends}
          />
        </div>
      ) : null}
    </>
  );
}

function FriendsList({ friends, onSetSelect, selected }) {
  return (
    <>
      <ul className="friends">
        {friends.map((friend, index) => (
          <Friend
            friend={friend}
            index={index}
            onSetSelect={onSetSelect}
            selected={selected}
            key={index}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, index, onSetSelect, selected }) {
  return (
    <li className="friend">
      <div>
        <img src={friend.imgUrl} alt={friend.name} />
      </div>
      <div>
        <div>
          <p style={{ fontWeight: "600" }}>{friend.name}</p>
          {friend.paying === null && (
            <span>{`You and ${friend.name} are even`} ✌️</span>
          )}

          <p>
            {friend.paying ? (
              <span style={{ color: "#990000" }}>
                {`You owe ${friend.name} ₱${friend.userExpense}`}
              </span>
            ) : friend.paying === false ? (
              <span style={{ color: "#009900" }}>
                {`${friend.name} owes you ₱${friend.expense}`}
              </span>
            ) : null}
          </p>

          {/* bill
          <p>{friend.bill}</p>
          friend
          <p>{friend.userExpense}</p>
          paying
          <p>{friend.paying}</p> */}
        </div>
        <button onClick={() => onSetSelect(index)}>
          {selected !== index ? "Select" : "Selected"}
        </button>
      </div>
    </li>
  );
}

function AddFriend({ setFriends }) {
  function generateRandomName() {
    const randomNames = [
      "Alice",
      "Bob",
      "Charlie",
      "David",
      "Eva",
      "Frank",
      "Grace",
      "Henry",
      "Ivy",
      "Jack",
    ];
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    return randomNames[randomIndex];
  }

  function generateAvatarUrl() {
    const baseUrl = "https://xsgames.co/randomusers/avatar.php?g=pixel&name=";
    const randomName = generateRandomName();
    const encodedName = encodeURIComponent(randomName);
    return baseUrl + encodedName;
  }

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState(generateAvatarUrl);

  function handleSubmit(e) {
    e.preventDefault();
    const newFriend = {
      name: friendName,
      imgUrl: friendImage,
      userExpense: 0,
      expense: 0,
      bill: 0,
      paying: null,
    };

    setFriends((prevFriends) => [...prevFriends, newFriend]);
    setFriendName("");
    setFriendImage(generateAvatarUrl);
  }

  return (
    <>
      {isAddOpen ? (
        <form className="add-friend" onSubmit={handleSubmit}>
          <label htmlFor="">🤼 Friend Name</label>
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
          />
          <label htmlFor="">🌆 Image URL</label>
          <input
            type="text"
            value={friendImage}
            onChange={(e) => setFriendImage(e.target.value)}
          />
          <div></div>
          <button>Add</button>
        </form>
      ) : (
        ""
      )}
      <button className="open-close" onClick={() => setIsAddOpen(!isAddOpen)}>
        {isAddOpen ? "Close" : "Add Friend"}
      </button>
    </>
  );
}

function SplitBill({ selectedFriend, setFriends, friends, selected }) {
  const [bill, setBill] = useState(0);
  const [userExpense, setUserExpense] = useState(0);
  const [paying, setPaying] = useState(false);

  function modifyExpenses(e) {
    console.log("yawa");
    e.preventDefault();
    const modifiedFriend = {
      ...selectedFriend,
      bill,
      userExpense,
      expense: bill - userExpense,
      paying,
    };
    const updatedFriends = [...friends];
    updatedFriends[selected] = modifiedFriend;
    setFriends(updatedFriends);
    setBill(0);
    setUserExpense(0);
    setPaying(false);
  }
  return (
    <>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <form className="split-form" onSubmit={(e) => modifyExpenses(e)}>
        <label>💰 Bill Value</label>
        <input
          min={1}
          type="number"
          value={bill}
          onChange={(e) => setBill(e.target.value.replace(/\D/, ""))}
        />
        <label>👨 Your expense</label>
        <input
          min={1}
          type="number"
          value={userExpense}
          onChange={(e) => setUserExpense(e.target.value.replace(/\D/, ""))}
        />
        <label>🙍‍♀️ {selectedFriend.name}'s expense</label>
        <input
          disabled
          type="number"
          value={bill - userExpense}
          pattern="[0-9]*"
          min={0}
        />
        <label>🤑 Who is paying the bill?</label>
        <select value={paying} onChange={(e) => setPaying(e.target.value)}>
          <option value={false}>You</option>
          <option value={true}>{selectedFriend.name}</option>
        </select>
        <div></div>
        <button
          style={{
            width: "max-content",
            marginLeft: "auto",
            display: "inline-block",
          }}
        >
          Split Bill
        </button>
      </form>
    </>
  );
}
