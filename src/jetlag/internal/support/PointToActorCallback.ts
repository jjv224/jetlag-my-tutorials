import { BaseActor } from "../../actor/BaseActor"
import { XY } from "./XY";

/**
 * PointToActorCallback is used by PhysicsType2d to determine if a coordinate in
 * the world corresponds to a BaseActor.
 */
export class PointToActorCallback implements PhysicsType2d.Dynamics.IQueryCallback {
    /** If we found an actor, we'll put it here */
    private foundActor: BaseActor = null;

    /** A helper vector for tracking the location that is being queried */
    private touchVector = new XY(0, 0);

    /** The tolerance when looking in a region around a point */
    private readonly delta = .1;

    /** The bounding box around the point that is being tested */
    private aabb = new PhysicsType2d.Collision.AxisAlignedBoundingBox();

    /** Destructor is a no-op for our use of the IQueryCallback interface */
    Destructor(): void { }

    /**
     * ReportFixture is used by PhysicsType2d to see if the fixture that was
     * found meets the requirements we establish.  If so, it returns false, and
     * the search ends, with user cod knowing it can find the result via
     * getFoundActor().  If not, it returns true, and the search continues.
     *
     * @param fixture The fixture that was found, and which needs to be tested
     *
     * @returns True if the fixture isn't satisfactory, and the search should
     *          continue
     */
    ReportFixture(fixture: PhysicsType2d.Dynamics.Fixture) {
        // Our only requirement is that the BaseActor associated with the
        // fixture must be active
        if (fixture.TestPoint(this.touchVector)) {
            let b = fixture.GetBody().GetUserData() as BaseActor;
            if (b.getEnabled()) {
                this.foundActor = b;
                return false;
            }
        }
        return true;
    }

    /**
     * Returns the most recently found actor, or null if the most recent search
     * failed
     */
    public getFoundActor() { return this.foundActor; }

    /**
     * Set the coordinates of a search and initiate a query to find an actor
     * within the search region
     *
     * @param x The X coordinate of the search, in meters
     * @param y The Y coordinate of the search, in meters
     */
    query(x: number, y: number, world: PhysicsType2d.Dynamics.World) {
        this.foundActor = null;
        this.touchVector.x = x;
        this.touchVector.y = y;
        this.aabb.lowerBound.x = x - this.delta;
        this.aabb.lowerBound.y = y - this.delta;
        this.aabb.upperBound.x = x + this.delta;
        this.aabb.upperBound.y = y + this.delta;
        world.QueryAABB(this, this.aabb);
    }
}