const { User, Thought } = require('../models');

const userController = {
    // get all users.
    getAllUsers(req, res) {
        User.find({})
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })        
        .select('-__v')
        .sort({_id: -1})
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // get one user by id.
    getUserById({ params }, res) {
        User.findOne({_id: params.id })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    // create a user.
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.json(err));
    },

    //Update an user by id.
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.json(err))
    },

    //delete a user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUsersData => res.json(dbUsersData))
        .then( async dbUserData => {
            await Thought.deleteMany({username: dbUserData._id}) //Autodelete related thoughts.
            await User.updateMany({ //Autodelete from related friend lists.
                _id: {
                    $in: dbUserData.friends
                }
            }, {
                $pull: {
                    friends: params.userId
                }
            })
            res.json({message: "User deleted from friends lists, and associated thoughts also deleted."})
        })

        .catch(err => {
            res.status(400).json(err);
        })
    },

    //Add a friend to a user by id.
    addFriend({params}, res) {
        User.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'No user found with this id!'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },
    //Delete a friend from a user bt id.
    deleteFriend({ params }, res) {
        User.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId }}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No friend found with this id!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = userController;